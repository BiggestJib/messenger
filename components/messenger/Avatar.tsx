// components/messenger/Avatar.tsx

"use client"; // This indicates the component will run on the client side

import { User } from "@prisma/client"; // Import User type from Prisma
import Image from "next/image"; // Next.js Image component for optimized image loading
import React, { useState, useEffect } from "react"; // Import React and useState hook
import ImageModal from "./ImageModal"; // Modal component to display image in full-screen mode
import useActiveList from "@/hooks/useActiveList"; // Hook to get the list of active users

interface AvatarProps {
  user?: User; // User prop is optional and based on Prisma User type
  settings?: boolean; // Optional settings prop to control modal rendering
}

const Avatar: React.FC<AvatarProps> = ({ user, settings }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false); // State to control modal visibility

  // Provide a fallback image if user's image is undefined or null
  const imageSrc = user?.image || "/images/R.jpeg";

  const { members } = useActiveList(); // Get active members from Zustand store
  const isActive = members.includes(user?.email || ""); // Check if user is in the active members list

  // Debugging: Log members and user email
  useEffect(() => {
    console.log("Active members:", members);
    console.log("User email:", user?.email);
  }, [members, user?.email]);

  return (
    <div className="relative">
      {!settings && (
        <ImageModal
          src={imageSrc} // Fallback to default image if user's image is unavailable
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)} // Close modal handler
        />
      )}
      <div className="relative inline-block rounded-full overflow-hidden w-9 h-9 md:h-11 md:w-11">
        {/* Avatar image */}
        <Image
          onClick={() => setImageModalOpen(true)} // Open modal on click
          alt="Avatar" // Alt text for accessibility
          fill // Ensures the image fills the container dimensions
          src={imageSrc} // Image source
          className="cursor-pointer" // Add pointer cursor when hovering over the avatar
        />
      </div>
      {isActive && (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
        // If the user is active, show a green dot at the top-right corner of the avatar
      )}
    </div>
  );
};

export default Avatar;
