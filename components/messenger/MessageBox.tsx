"use client"; // Ensures that this component runs on the client-side

import { FullMessageType } from "@/app/types";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { format } from "date-fns"; // To format the message timestamp
import Image from "next/image"; // To handle image rendering in messages
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: FullMessageType; // Data structure containing message details
  isLast: boolean; // A flag to determine if this is the last message in the list
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  // Check if the message was sent by the current user
  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [messages, setMessage] = useState("");

  // Create a list of users who have seen the message, excluding the sender
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email) // Exclude sender from the seen list
    .map((user) => user.name) // Extract the name of each user
    .join(", "); // Join the names into a comma-separated string

  // Conditional class names for the message container, avatar, body, and message
  const container = `flex gap-3 p-4 ${isOwn ? "justify-end" : ""}`;
  const avatar = `${isOwn ? "order-2" : ""}`; // Avatar position changes based on whether the message is from the current user
  const body = `flex break-words flex-col gap-2 ${isOwn ? "items-end" : ""}`;
  const message = `text-sm w-fit break-words overflow-hidden ${
    isOwn ? "bg-sky-500 text-white" : "bg-gray-400 text-white"
  } ${data.image ? "rounded-md p-0" : "rounded-2xl py-2 px-3"}`; // Different styles for text vs. image messages

  return (
    <div className={container}>
      {/* Display avatar unless it's the user's own message */}
      <div className={body}>
        {/* Show sender's name and message timestamp */}
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
        </div>

        {/* Render either an image or a text message */}
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              className="object-cover hover:scale-110 transition transform cursor-pointer"
              height="288"
              width="288"
              src={data.image}
              alt="image" // Display image message if available
            />
          ) : (
            <div className="grid-cols-4 min-w-[100px] max-w-[500px] gap-4 items-center justify-between">
              <div className="col-span-2 text-base ">
                <div style={{ whiteSpace: "pre-wrap" }}>{data.body}</div>
              </div>
              <div className=" text-gray-600 text-right text-sm t00 col-span-1 ">
                {format(new Date(data.createdAt), "p")}{" "}
                {/* Formats the message timestamp */}
              </div>
            </div>
          )}
        </div>

        {/* If the message is the last one and sent by the user, show seen status */}
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs text-light text-gray-500">{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
