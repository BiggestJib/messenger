// Importing Prisma client from a custom path to interact with the database
import prisma from "@/app/libs/prismadb";

// Importing a helper function to get the current authenticated user
import { getCurrentUser } from "./getCurrentUser";

// Asynchronous function to retrieve a specific conversation by its ID
const getConversationById = async (conversationIds: string) => {
  try {
    // Fetch the currently authenticated user
    const currentUser = await getCurrentUser();

    // If there's no current user or their email is undefined, return null (conversation not found)
    if (!currentUser?.email) return null;

    // Query the Prisma database for a conversation with the given ID
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationIds, // Filtering the conversation by the provided conversation ID
      },
      include: {
        users: true, // Including the users associated with the conversation in the result
      },
    });

    // Return the found conversation
    return conversation;
  } catch (error) {
    // In case of an error during the database query, return null
    return null;
  }
};

// Exporting the function for use in other parts of the app
export default getConversationById;
