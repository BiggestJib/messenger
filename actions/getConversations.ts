// Importing Prisma client from a custom path to interact with the database
import prisma from "@/app/libs/prismadb";

// Importing a helper function to get the current authenticated user
import { getCurrentUser } from "./getCurrentUser";

// Function to retrieve conversations associated with the current user
const getConversations = async () => {
  // Get the currently authenticated user
  const currentUser = await getCurrentUser();

  // If there's no current user (not authenticated), return an empty array
  if (!currentUser) {
    return [];
  }

  try {
    // Query the database to find conversations involving the current user
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc", // Order the conversations by the latest message in descending order
      },
      where: {
        userIds: {
          has: currentUser.id, // Filter conversations where the current user's ID is included in the userIds array
        },
      },
      include: {
        users: true, // Include information about the users involved in each conversation
        messages: {
          include: {
            sender: true, // Include the sender's information for each message
            seen: true, // Include information on whether the message has been seen
          },
        },
      },
    });

    // Return the list of conversations
    return conversations;
  } catch (error: any) {
    // If an error occurs, return an empty array
    return [];
  }
};

// Export the function as the default export
export default getConversations;
