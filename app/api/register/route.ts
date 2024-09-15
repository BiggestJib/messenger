import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // Check if required fields are provided
    if (!email || !name || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if the user already exists in the database by email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // If the user exists, return an error
    if (existingUser) {
      return new NextResponse("Email already registered", { status: 400 });
    }

    // Hash the password securely using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword, // Save the hashed password
      },
    });

    // Return the newly created user as a JSON response
    return NextResponse.json(user);
  } catch (err) {
    console.error("REGISTRATION_ERROR:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
