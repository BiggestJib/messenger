import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { User, Conversation, Message } from "@prisma/client";
import { FullConversationType } from "@/app/types";

const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  // useSession returns an object, and session.data holds the current session (user) information.
  const session = useSession();

  const otherUser = useMemo(() => {
    // Retrieve the current user's email from the session data
    const currentUserEmail = session?.data?.user?.email;

    // Filter the users in the conversation to exclude the current user
    const otherUser = conversation?.users?.filter(
      (user) => user.email !== currentUserEmail
    );

    // Return the other user(s). This will return an array of users.
    return otherUser[0];
    // Dependency array ensures memoization is done when 'conversation' or 'session?.data?.user?.email' changes.
  }, [conversation, session?.data?.user?.email]);

  // Return the memoized other user(s)
  return otherUser;
};

export default useOtherUser;
