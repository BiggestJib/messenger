// pages/api/messages.ts

import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/libs/pusher";

// Utility function to sanitize inputs
function sanitizeInput(input: string) {
  return input.replace(/<\/?[^>]+(>|$)/g, ""); // Simple sanitizer that removes HTML tags
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { image, conversationId, message, clientId } = body; // Extract clientId

    const sanitizedMessage = sanitizeInput(message);
    const sanitizedImage = image ? sanitizeInput(image) : null;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true },
    });

    if (!conversation) {
      return new NextResponse("Invalid Conversation ID", { status: 400 });
    }

    const isGroupChat = conversation.users.length > 2;

    const newMessage = await prisma.message.create({
      data: {
        body: sanitizedMessage,
        image: isGroupChat ? sanitizedImage : null,
        createdAt: new Date(),
        conversation: { connect: { id: conversationId } },
        sender: { connect: { id: currentUser.id } },
        seen: { connect: { id: currentUser.id } },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messages: { connect: { id: newMessage.id } },
      },
      include: { users: true },
    });

    await pusherServer.trigger(conversationId, "messages:new", {
      id: newMessage.id,
      body: newMessage.body,
      sender: {
        id: newMessage.sender.id,
        name: newMessage.sender.name,
        email: newMessage.sender.email,
      },
      image: isGroupChat ? newMessage.image : null,
      createdAt: newMessage.createdAt,
      clientId, // Include clientId in the event
    });

    updatedConversation.users.forEach((user) => {
      pusherServer.trigger(user.email!, "conversation:user", {
        id: conversationId,
        lastMessage: {
          id: newMessage.id,
          body: newMessage.body,
          sender: {
            id: newMessage.sender.id,
            name: newMessage.sender.name,
            email: newMessage.sender.email,
          },
          image: isGroupChat ? newMessage.image : null,
          createdAt: newMessage.createdAt,
        },
      });
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.log(error, "ERROR_MESSAGES");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
