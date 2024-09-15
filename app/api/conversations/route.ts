import { getCurrentUser } from "@/actions/getCurrentUser"; // Importing the function to get the current logged-in user
import { NextResponse } from "next/server"; // Importing Next.js's NextResponse object for handling responses
import prisma from "@/app/libs/prismadb"; // Importing Prisma client to interact with the database
import { pusherServer } from "@/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser(); // Fetch the currently authenticated user
    const body = await request.json(); // Parse the incoming request body as JSON
    const { userId, isGroup, members, name } = body; // Destructure the necessary fields from the request body

    // Check if the user is authenticated (user must have both id and email)
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 }); // Return a 401 Unauthorized response if not authenticated
    }

    // If it's a group conversation, ensure that the members array and name are provided and that there are at least 1 members
    if (isGroup && (!members || members.length < 1 || !name)) {
      return new NextResponse("Missing required fields", { status: 400 }); // Return a 400 Bad Request response if any required field is missing
    }

    // If creating a group conversation, handle it here
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name, // Group name
          isGroup, // Indicate that this is a group conversation
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value, // Connect each member by their user ID
              })),
              {
                id: currentUser.id, // Include the current user in the group
              },
            ],
          },
        },
        include: {
          users: true, // Include users in the response
        },
      });
      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConversation);
        }
      });
      return NextResponse.json(newConversation); // Return the newly created group conversation as JSON
    }

    // Check if a one-on-one conversation already exists between the two users
    const existingConversations = await prisma.conversation.findMany({
      where: {
        isGroup: false, // Exclude group conversations
        userIds: {
          hasEvery: [currentUser.id, userId], // Ensure the conversation contains both users
        },
      },
    });

    // Get the first matching one-on-one conversation
    const singleConversation = existingConversations.find((conv) => {
      return conv && conv.userIds && conv.userIds.length === 2; // Ensure it's a one-on-one conversation
    });

    if (singleConversation) {
      // If a conversation exists, return it
      return NextResponse.json(singleConversation);
    }

    // If no existing conversation is found, create a new one
    const newConversation = await prisma.conversation.create({
      data: {
        isGroup: false, // Ensure the new conversation is not a group
        users: {
          connect: [
            { id: currentUser.id }, // Connect the current user
            { id: userId }, // Connect the other user
          ],
        },
      },
      include: {
        users: true, // Include users in the response
      },
    });

    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });

    // Return the newly created conversation
    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse(`Internal server error: ${error.message}`, {
      status: 500, // Return a 500 Internal Server Error response if something goes wrong
    });
  }
}
