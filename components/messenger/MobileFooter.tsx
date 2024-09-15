"use client";
import { useConversation } from "@/hooks/useConversation";
import useRoutes from "@/hooks/useRoute";
import React, { useState } from "react";
import MobileItem from "./MobileItem";
import Avatar from "./Avatar";
import { User } from "@prisma/client";
import SettingModal from "./SettingsModal";

interface MobileSidebarProps {
  currentUser: User;
}

const MobileFooter: React.FC<MobileSidebarProps> = ({ currentUser }) => {
  const [isOpened, setIsOpen] = useState(false); // Initialize `isOpen` with a boolean value

  const routes = useRoutes();
  const { isOpen } = useConversation();
  if (isOpen) {
    return null;
  }
  return (
    <>
      <SettingModal
        isOpen={isOpened}
        onClose={() => {
          setIsOpen(false);
        }}
        currentUser={currentUser}
      />
      <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t [1px] lg:hidden">
        {routes.map((route) => (
          <MobileItem
            key={route.label}
            href={route.href}
            icon={route.icon}
            active={route?.active}
            onClick={route.onClick} // Pass onClick if it exists
          />
        ))}
        <div
          className="cursor-pointer hover:opacity-75 transition"
          onClick={() => {
            setIsOpen(!isOpened);
          }}
        >
          <Avatar settings user={currentUser} />
        </div>
      </div>
    </>
  );
};

export default MobileFooter;
