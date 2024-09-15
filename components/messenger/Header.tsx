"use client";

import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "./Avatar";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "./AvatarGroup";
import useActiveList from "@/hooks/useActiveList";

// Type for the conversation, including the list of users
interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
  users: User[];
}

const Header: React.FC<HeaderProps> = ({ conversation, users }) => {
  // Using the custom hook to get the other user involved in the conversation
  const otherUser = useOtherUser(conversation);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  // Memoized status text, optimized to recompute only when conversation changes
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`; // Added space between the number and "members"
    }

    return isActive ? <div className="text-sky-500">Online </div> : "Offline"; // Default status for non-group conversations
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer
        users={users}
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />{" "}
      <div className="bg-white w-full flex border-b-[1px] justify-between items-center shadow-sm sm:px-4 px-4 lg:px-6 py-3">
        <div className="flex gap-3 items-center">
          {/* Back button visible on smaller screens */}
          <Link
            className="lg:hidden block hover:text-sky-600 transition cursor-pointer text-sky-500"
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>

          {/* Avatar for the other user */}
          {!conversation.isGroup ? (
            <Avatar user={otherUser} />
          ) : (
            <AvatarGroup users={conversation.users} />
          )}

          <div className="flex flex-col">
            {/* Display conversation name or the other user's name */}
            <div>{conversation.name || otherUser?.name}</div>
            {/* Status text, showing group member count or active status */}
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>

        {/* Ellipsis icon, clickable, but the handler is currently empty */}
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)} // Placeholder onClick handler
          className="text-sky-500 cursor-pointer hover:text-sky-500 transition"
        />
      </div>
    </>
  );
};

export default Header;
