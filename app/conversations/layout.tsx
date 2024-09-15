import Sidebar from "@/components/messenger/Sidebar";
import React from "react";
import ConversationList from "@/components/messenger/ConversationList";
import getConversations from "@/actions/getConversations";
import getUsers from "@/actions/getUsers";

const ConversationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const conversations = await getConversations();
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList users={users} initialItems={conversations} />
        {children}
      </div>
    </Sidebar>
  );
};

export default ConversationLayout;
