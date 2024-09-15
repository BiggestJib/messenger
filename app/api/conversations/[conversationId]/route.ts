import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;

    // Get the current user
    const currentUser = await getCurrentUser();

    // If user is not authenticated, return 401 Unauthorized
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the conversation by ID, including the users in the conversation
    const existingConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: true, // Include users for validation
      },
    });

    // If no conversation is found, return 400 Bad Request
    if (!existingConversation) {
      return new NextResponse("Conversation not found", { status: 400 });
    }

    // Delete the conversation, but only if the current user is part of the conversation
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id], // Wrap currentUser.id in an array
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    });

    // Return the deleted conversation as a JSON response
    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.log(error, "Error_conversation_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
