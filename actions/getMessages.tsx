// Importing Prisma client from a custom path to interact with the database
import prisma from "@/app/libs/prismadb";

// Asynchronous function to retrieve messages for a specific conversation
const getMessages = async (conversationId: string) => {
  try {
    // Querying the Prisma database to find all messages for the given conversation ID
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId, // Filtering messages by conversation ID
      },
      include: {
        // Including the sender and seen information with each message
        sender: true, // Includes the sender (user) details for each message
        seen: true, // Includes information about users who have seen the message
      },
      orderBy: {
        createdAt: "asc", // Orders messages by their creation time in ascending order
      },
    });

    // Returning the list of messages
    return messages;
  } catch (error) {
    // In case of an error, return an empty array (no messages)
    return [];
  }
};

// Exporting the function for use in other parts of the app
export default getMessages;
