import { getCurrentUser } from "@/actions/getCurrentUser"; // Importing a function to get the currently authenticated user
import { NextResponse } from "next/server"; // Importing Next.js's response utility for server-side functions
import prisma from "@/app/libs/prismadb"; // Importing the Prisma client for database interactions

// API route handler to add a new user to an existing group conversation
export async function POST(
  request: Request,
  { params }: { params: { conversationId: string } } // Destructure the conversationId from URL params
) {
  try {
    // Retrieve the currently authenticated user
    const currentUser = await getCurrentUser();
    const body = await request.json(); // Parse the incoming request body (which contains user data)
    const { userId } = body; // Extract the new user's ID from the request body

    const { conversationId } = params; // Extract the conversation ID from the URL parameters

    // Check if the current user is authenticated (must have both an id and an email)
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 }); // Return a 401 Unauthorized response if the user is not authenticated
    }

    // Fetch the conversation by its ID, including users in the result to check if it's a group conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }, // Filter by conversation ID
      include: { users: true }, // Include the list of users in the conversation
    });

    // Check if the conversation exists
    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 }); // Return a 404 Not Found response if the conversation does not exist
    }

    // Check if the conversation is a group conversation
    if (!conversation.isGroup) {
      return new NextResponse("This is not a group conversation", {
        status: 400,
      }); // Return a 400 Bad Request response if the conversation is not a group
    }

    // Check if the user is already part of the group
    const userAlreadyInConversation = conversation.users.some(
      (user) => user.id === userId // Check if the new user's ID already exists in the conversation
    );

    if (userAlreadyInConversation) {
      return new NextResponse("User is already a member of this conversation", {
        status: 400,
      }); // Return a 400 Bad Request response if the user is already in the group
    }

    // Add the new user to the conversation group
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId }, // Specify which conversation to update
      data: {
        users: {
          connect: { id: userId }, // Add the new user to the users array
        },
      },
      include: { users: true }, // Include the updated list of users in the result
    });

    // Return the updated conversation with the new user added
    return NextResponse.json(updatedConversation);
  } catch (error: any) {
    // Catch any errors that occur and return a 500 Internal Server Error response
    console.error("Error adding user to conversation:", error); // Log the error for debugging purposes
    return new NextResponse(`Internal server error: ${error.message}`, {
      status: 500,
    });
  }
}
