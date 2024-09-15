"use client";

import useRoutes from "@/hooks/useRoute"; // Assuming the hook file is correctly named and located here
import React, { useState } from "react";
import DesktopItem from "./DesktopItem";
import { User } from "@prisma/client";
import Avatar from "./Avatar";
interface DesktopSidebarProps {
  currentUser: User;
}
import SettingModal from "./SettingsModal";

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes(); // Correct usage of the `useRoutes` hook
  const [isOpen, setIsOpen] = useState(false); // Initialize `isOpen` with a boolean value

  // console.log(currentUser);

  return (
    <>
      <SettingModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        currentUser={currentUser}
      />
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:flex lg:flex-col justify-between">
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item?.active}
                onClick={item.onClick} // Pass onClick if it exists
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col justify-between items-center">
          <div
            className="cursor-pointer hover:opacity-75 transition"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <Avatar settings user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
