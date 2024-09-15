"use client";

import React, { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  id,
  required = false,
  register,
  errors,
  value,
  onChange, // Pass the onChange handler to manage external changes like emojis
}) => {
  // Function to dynamically resize the textarea based on content
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto"; // Reset the height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the height based on content
  };

  return (
    <div className="relative w-full">
      <textarea
        id={id}
        {...register(id, { required })} // Register the field with react-hook-form
        autoComplete={id}
        placeholder={placeholder}
        value={value} // Bind value to state
        onChange={onChange} // Handle both manual and emoji changes
        onInput={handleInput} // Dynamically adjust height on input
        rows={1} // Start with a single row
        className={`text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-2xl resize-none focus:outline-none ${
          errors[id] ? "border-red-500" : ""
        }`}
        style={{
          maxHeight: "100px", // Maximum height of the textarea before it allows scrolling
          overflowY: "auto", // Allow vertical scrolling once the maxHeight is exceeded
        }}
      />
    </div>
  );
};

export default MessageInput;
