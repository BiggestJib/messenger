import { getCurrentUser } from "@/actions/getCurrentUser"; // Import function to get the current authenticated user
import { NextResponse } from "next/server"; // Import Next.js response object for API routes
import prisma from "@/app/libs/prismadb"; // Import the Prisma client to interact with the database

export async function POST(request: Request) {
  try {
    // Get the current authenticated user
    const currentUser = await getCurrentUser();

    // Parse the incoming JSON body to extract the name and image
    const body = await request.json();
    const { name, image } = body;

    // Validate if the user is authenticated
    if (!currentUser?.id) {
      // If no user is authenticated, return a 401 Unauthorized response
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the user's data in the database (image and name)
    const updateUser = await prisma.user.update({
      where: {
        id: currentUser.id, // Ensure we are updating the current authenticated user's record
      },
      data: {
        image: image, // Update the user's image
        name: name, // Update the user's name
      },
    });

    // Return the updated user object as a JSON response
    return NextResponse.json(updateUser);
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error(error, "Error_SETTINGS");

    // If an error occurs, return a 500 Internal Server Error response
    return new NextResponse("Internal error occurred", { status: 500 });
  }
}
