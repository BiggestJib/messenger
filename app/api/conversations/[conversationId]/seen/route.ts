import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; // Prisma client for database operations
import { pusherServer } from "@/libs/pusher";

// Define the structure of `params` using the IParams interface
interface IParams {
  conversationId: string; // Conversation ID as a string
}

// The POST function, which handles the request
export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    // Fetch the current authenticated user
    const currentUser = await getCurrentUser();

    // Extract the conversationId from params
    const { conversationId } = params;

    // If the current user is not authenticated (no id or email), return 401 Unauthorized
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    // Check if conversationId is provided
    if (!conversationId) {
      return new NextResponse("Conversation ID is missing", {
        status: 400,
      });
    }

    // Fetch the conversation with messages and users from the database
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId, // Filter by the conversation ID
      },
      include: {
        messages: {
          include: {
            seen: true, // Include the list of users who have seen the message
          },
        },
        users: true, // Include the users in the conversation
      },
    });

    // If no conversation is found, return 400 Bad Request
    if (!conversation) {
      return new NextResponse("Invalid ID", {
        status: 400,
      });
    }

    // Get the last message in the conversation
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    // If there is no last message, just return the conversation data
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // Check if the user has already seen the message
    const seenIds = lastMessage.seen.map((user) => user.id) || [];

    // If the current user has already seen the message, return the conversation
    if (seenIds.includes(currentUser.id)) {
      return NextResponse.json(conversation);
    }

    // Update the last message to include the current user in the seen list
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id, // Target the last message by its ID
      },
      include: {
        sender: true, // Include the sender's details
        seen: true, // Include the updated seen users list
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id, // Connect the current user to the seen list
          },
        },
      },
    });

    // Notify current user via Pusher
    try {
      await pusherServer.trigger(currentUser.email, "conversation:update", {
        id: conversationId,
        messages: [updatedMessage],
      });
    } catch (error) {
      console.log("Pusher error (conversation:update):", error);
    }

    // Notify all participants of the updated message
    try {
      await pusherServer.trigger(
        conversationId!,
        "message:update",
        updatedMessage
      );
    } catch (error) {
      console.log("Pusher error (message:update):", error);
    }

    // Return the updated message with the seen users
    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    // Log the error and return a 500 Internal Server Error response
    console.log(error, "ERROR_MESSAGES_SEEN");
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
