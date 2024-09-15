"use client";

import { FullMessageType } from "@/app/types";
import { useConversation } from "@/hooks/useConversation";
import React, { useState, useRef, useEffect, useCallback } from "react";
import MessageBox from "./MessageBox";
import { HiOutlineChat, HiArrowDown } from "react-icons/hi";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null); // Reference to the bottom of the chat
  const messageContainerRef = useRef<HTMLDivElement>(null); // Reference to the message container
  const { conversationId } = useConversation(); // Get current conversation ID

  // Helper function to scroll to the bottom of the message container
  const scrollToBottom = useCallback(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessagesCount(0); // Reset the new message counter when scrolled to bottom
  }, []);

  // Function to determine if the user is near the bottom of the chat
  const isNearBottom = () => {
    if (!bottomRef?.current || !messageContainerRef?.current) return false;
    const { scrollHeight, scrollTop, clientHeight } =
      messageContainerRef.current;
    return scrollHeight - scrollTop <= clientHeight + 100; // Adjust threshold
  };

  // Function to track user scrolling and determine if they're near the bottom
  const handleScroll = () => {
    if (messageContainerRef?.current) {
      const nearBottom = isNearBottom();
      setIsUserAtBottom(nearBottom);
      if (nearBottom) {
        setNewMessagesCount(0); // Reset new message count when user scrolls to the bottom
      }
    }
  };

  // Effect to mark conversation as "seen" on mount and when conversationId changes
  useEffect(() => {
    const markAsSeen = async () => {
      try {
        await fetch(`/api/conversations/${conversationId}/seen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error marking as seen:", error);
      }
    };
    markAsSeen();
  }, [conversationId]);

  // Effect to handle Pusher event subscription for new messages
  useEffect(() => {
    const messageHandler = (message: FullMessageType) => {
      fetch(`/api/conversations/${conversationId}/seen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMessages((current) => {
        // Avoid adding duplicate messages
        if (find(current, { id: message.id })) return current;
        return [...current, message];
      });

      if (isNearBottom()) {
        // Automatically scroll to bottom if user is near the bottom
        setTimeout(() => {
          scrollToBottom();
        }, 100); // Ensure smooth scroll after message render
      } else {
        // If user is not at the bottom, increment the new messages count
        setNewMessagesCount((prev) => prev + 1);
      }
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    // Subscribe to the Pusher channel
    pusherClient.subscribe(conversationId);
    pusherClient.bind("messages:new", messageHandler);

    // Scroll to the bottom on mount
    scrollToBottom();

    pusherClient.bind("messages:update", updateMessageHandler);

    // Cleanup on unmount
    return () => {
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:update", updateMessageHandler);
    };
  }, [conversationId, scrollToBottom]);

  return (
    <>
      {/* No messages UI */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <HiOutlineChat className="h-16 w-16 mb-4 text-sky-500" />
          <p className="text-lg font-semibold">No messages yet</p>
          <p className="text-sm text-gray-400">
            Start a conversation by sending a message!
          </p>
        </div>
      )}

      {/* Message list */}
      {messages.length > 0 && (
        <div
          ref={messageContainerRef}
          onScroll={handleScroll} // Track scrolling
          className="flex-1 overflow-y-auto relative"
        >
          {messages.map((message, i) => (
            <MessageBox
              isLast={i === messages.length - 1}
              key={message.id}
              data={message}
            />
          ))}
          {/* Scroll reference */}
          <div ref={bottomRef} className="pt-2"></div>

          {/* Scroll to bottom arrow */}
          {!isUserAtBottom && (
            <button
              onClick={scrollToBottom}
              className="fixed bottom-28  right-5 p-2 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
            >
              <div className="relative">
                <HiArrowDown className="h-6 w-6" />
                {newMessagesCount > 0 && (
                  <span className="absolute -top-3 -right-2 h-5 w-5 text-xs font-semibold bg-red-500 text-white rounded-full flex items-center justify-center">
                    {newMessagesCount}
                  </span>
                )}
              </div>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Body;
