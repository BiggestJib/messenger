"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Conversation, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useConversation } from "@/hooks/useConversation";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import { FullConversationType } from "@/app/types";
import GroupChatModal from "./GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState(""); // State to handle the search query
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();
  const pusherKey = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }
    pusherClient.subscribe(pusherKey);
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };
    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }
          return currentConversation;
        })
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });
      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, router, conversationId]);

  // Filter conversations based on search query for both conversation names, users, and messages
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter by conversation name, message content, or user names in the conversation
      const matchesConversationName = item.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMessage = item.messages.some((message) =>
        message.body?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesUser = item.users.some((user) =>
        user.name!.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return matchesConversationName || matchesMessage || matchesUser;
    });
  }, [items, searchQuery]);

  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        users={users}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 pb-20 lg:pb-20 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 ${
          isOpen ? "hidden" : "block w-full left-0"
        }`}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {/* Search input for filtering conversations */}
          <div className="py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages or users..."
              className="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filtered conversations */}
          {filteredItems.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
          {filteredItems.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              No conversations found
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
