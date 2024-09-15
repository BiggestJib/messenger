"use client"; // Ensures this file is executed on the client-side, since we are using client-specific hooks like useState, useCallback, and useRouter

import { User } from "@prisma/client"; // Importing the User type from Prisma schema
import { useRouter } from "next/navigation"; // Importing the Next.js router for programmatic navigation
import React, { useCallback, useState } from "react"; // React hooks to handle state and performance optimizations
import Avatar from "./Avatar"; // A component that renders the user's avatar
import LoadingModal from "./LoadingModal";

// Defining the props interface for the component; it expects `data` of type User
interface UserBoxProps {
  data: User;
}

// A functional component that displays a user box and allows for starting conversations by clicking on it
const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter(); // Using the Next.js router to navigate between pages
  const [isLoading, setIsLoading] = useState(false); // State to track whether the conversation creation process is in progress (loading)

  // useCallback ensures that `handleClick` is memoized, i.e., the function reference doesn't change unnecessarily
  const handleClick = useCallback(() => {
    setIsLoading(true); // Start loading (disable the UI and show loading state)

    // Sending a POST request to create a new conversation for the user
    fetch("/api/conversations", {
      method: "POST",
      body: JSON.stringify({
        userId: data.id, // Sending the user's ID to the server to start a conversation
      }),
      headers: {
        "Content-Type": "application/json", // Ensuring the request body is in JSON format
      },
    })
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        router.push(`/conversations/${data.id}`); // Navigate to the new conversation page based on the conversation ID from the server response
      })
      .finally(() => setIsLoading(false)); // Once done (either success or failure), stop loading
  }, [data, router]); // `useCallback` ensures that this function only changes if `data` or `router` changes

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        // Only allow clicking if it's not loading; otherwise, disable the click event
        onClick={!isLoading ? handleClick : undefined}
        className={`w-full relative flex items-center space-x-3 bg-white hover:bg-neutral-100 rounded-lg transition cursor-pointer ${
          isLoading ? "opacity-50 cursor-not-allowed" : "" // Change appearance when loading: dim and show a 'not-allowed' cursor
        }`}
      >
        {/* Render the user's avatar using the Avatar component */}
        <Avatar user={data} />

        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              {/* Display the user's name */}
              <p className="text-sm font-medium text-gray-900">{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
