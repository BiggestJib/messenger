"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useOtherUser from "@/hooks/useOtherUser"; // Custom hook to find the other user in the conversation
import { FullConversationType } from "@/app/types"; // Assuming FullConversationType includes the conversation details with messages and users
import Avatar from "./Avatar"; // Avatar component to show user profile picture
import { format } from "date-fns"; // Corrected: Use only 'format' from 'date-fns'
import AvatarGroup from "./AvatarGroup";

interface ConversationBoxProps {
  data: FullConversationType; // Conversation data type
  selected?: boolean; // Optional selected state for UI purposes
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  // Find the other user in the conversation
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  // Function to handle clicks and redirect to the conversation page
  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [router, data.id]);

  // Memoized value to get the last message in the conversation
  const lastMessage = useMemo(() => {
    const messages = data.messages || []; // Ensure messages array is not undefined
    return messages[messages.length - 1]; // Return the last message
  }, [data.messages]);

  // Get the current user's email from session data
  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  // Check if the last message has been seen by the current user
  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false; // No last message, hence nothing to "see"
    }
    const seenArray = lastMessage.seen || []; // Get users who have seen the message

    if (!userEmail) {
      return false; // No current user email to compare with
    }
    return seenArray.filter((user) => user.email === userEmail).length !== 0; // Check if current user has seen the message
  }, [userEmail, lastMessage]);

  // Determine the text for the last message (image, body, or fallback)
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image"; // If last message contains an image
    }
    if (lastMessage?.body) {
      return lastMessage.body; // If last message has text content
    }
    return "Started a conversation"; // Default message when no body or image
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick} // Handle click to navigate to the conversation
      className={`w-full relative flex items-center space-x-2 hover:bg-neutral-100 rounded-lg transition p-3 cursor-pointer ${
        selected ? "bg-neutral-100" : "bg-white"
      }`}
    >
      {/* Display the avatar of the other user */}
      {!data.isGroup ? (
        <Avatar user={otherUser} />
      ) : (
        <AvatarGroup users={data.users} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            {/* Display the name of the conversation or the other user's name */}
            <p className="text-xs font-medium text-gray-900">
              {data.name || otherUser?.name}{" "}
              {/* Use optional chaining for safety */}
            </p>
            {/* Display the formatted creation date of the last message */}
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMessage.createdAt), "p")}{" "}
                {/* Format date using 'date-fns' */}
              </p>
            )}
          </div>
          {/* Display the last message text, and style it based on whether it's been seen */}
          <p
            className={`truncate text-sm ${
              hasSeen ? "text-gray-500" : "text-black font-medium"
            }`}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
