import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb"; // Adjust this import according to your project structure
import getSession from "@/actions/useSession"; // Import your session logic

// API Handler to fetch users
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch the current session
    const session = await getSession(); // Ensure you pass the request to getSession if necessary

    // Check if session is valid and email exists
    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch users from Prisma, excluding the logged-in user
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email as string, // Exclude the current logged-in user's email
        },
      },
    });
    console.log(JSON.stringify(users));
    // Respond with the fetched users
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    // Handle any error and return a 500 status
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}
