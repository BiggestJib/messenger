// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/app/libs/authOptions";

// The new routing system in Next.js 13 requires explicit exports for each HTTP method.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
