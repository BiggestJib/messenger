"use client";

import { User } from "@prisma/client";
import React from "react";
import UserBox from "./UserBox";

// Define the props for the component
interface UserListProps {
  items: User[]; // An array of users is expected
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 w-full left-0">
      <div className="px-5">
        <div className="flex-col">
          {/* Title for the user list */}
          <div className="text-2xl font-bold text-neutral-800 py-4">People</div>
          {/* List of users */}
          <ul>
            {items.map((item) => (
              <UserBox key={item.id} data={item} />
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default UserList;
