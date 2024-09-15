"use client";

import { User } from "@prisma/client";
import React, { useState, useMemo } from "react";
import UserBox from "./UserBox";

// Define the props for the component
interface UserListProps {
  items: User[]; // An array of users is expected
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  // State for the search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Memoized filtered users to prevent re-calculation on every render
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item?.name!.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 w-full left-0 bg-white">
      <div className="px-5">
        <div className="flex-col">
          {/* Title for the user list */}
          <div className="text-2xl font-bold text-neutral-800 py-4">People</div>

          {/* Search input */}
          <div className="py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* List of filtered users */}
          <ul className="space-y-2 mt-4">
            {filteredItems.map((item) => (
              <UserBox key={item.id} data={item} />
            ))}
            {filteredItems.length === 0 && (
              <div className="text-center text-gray-500 mt-4">
                No users found
              </div>
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default UserList;
