"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import ImageModal from "./ImageModal";

interface AvatarGroupProps {
  users: User[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
  const sliceUser = users.slice(0, 3); // Display the first 3 users
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null); // Track which modal is open
  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-[0]",
  };

  return (
    <div className="relative h-11 w-11">
      {sliceUser.map((user, index) => (
        <div
          key={user.id}
          className={`absolute rounded-full overflow-hidden w-[24px] h-[24px] inline-block ${
            positionMap[index as keyof typeof positionMap]
          }`}
        >
          {/* Individual modal for each avatar */}
          <ImageModal
            src={user?.image || "/images/default-avatar.jpeg"} // Consistent fallback image
            isOpen={openModalIndex === index} // Check if this modal should be open
            onClose={() => setOpenModalIndex(null)} // Close modal when needed
          />
          <Image
            onClick={() => setOpenModalIndex(index)} // Open corresponding modal on click
            alt="Avatar"
            fill
            src={user?.image || "/images/default-avatar.jpeg"} // Fallback image for the avatar
            className="object-cover cursor-pointer" // Ensure image is clickable and contained
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
