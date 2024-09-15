// /contexts/ConversationContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { FullMessageType } from "@/app/types";

interface ConversationContextType {
  messages: FullMessageType[];
  setMessages: React.Dispatch<React.SetStateAction<FullMessageType[]>>;
  addMessage: (message: FullMessageType) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversationContext must be used within a ConversationProvider"
    );
  }
  return context;
};

interface ConversationProviderProps {
  children: ReactNode;
  initialMessages: FullMessageType[];
}

export const ConversationProvider: React.FC<ConversationProviderProps> = ({
  children,
  initialMessages,
}) => {
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);

  const addMessage = (message: FullMessageType) => {
    setMessages((current) => [...current, message]);
  };

  return (
    <ConversationContext.Provider value={{ messages, setMessages, addMessage }}>
      {children}
    </ConversationContext.Provider>
  );
};
