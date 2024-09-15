import prisma from "@/app/libs/prismadb";
import getSession from "./useSession";

export const getCurrentUser = async () => {
  try {
    const session = await getSession();
    if (!session?.user?.email) return;

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });
    if (!currentUser) return;
    return currentUser;
  } catch (error: any) {
    return;
  }
};
