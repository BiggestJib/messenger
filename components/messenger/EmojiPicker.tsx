"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FiSmile } from "react-icons/fi";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onChange }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <FiSmile
          size={24}
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
        />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={10}
        className="bg-white p-2 border rounded-lg shadow-lg"
      >
        <Picker
          theme="light" // You can change this to "dark" if needed
          onEmojiSelect={(emoji: any) => onChange(emoji.native)} // Handle emoji selection
          data={data}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
