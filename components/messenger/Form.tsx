"use client"; // Ensures this component runs on the client-side

import { useConversation } from "@/hooks/useConversation";
import React, { useState } from "react";
import {
  useForm,
  Controller,
  FieldValues,
  SubmitHandler,
} from "react-hook-form";
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2"; // Combined import for icons
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary"; // Cloudinary upload button
import EmojiPicker from "./EmojiPicker";

const Form = () => {
  const { conversationId } = useConversation(); // Retrieve conversation ID from custom hook
  const [message, setMessage] = useState(""); // Manage the message value in state

  const {
    register,
    handleSubmit,
    setValue, // Function to reset or programmatically set form values
    control,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "", // Set default value for the message input
    },
  });

  // Form submission handler
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Reset the message field after form submission
    setValue("message", "", { shouldValidate: true });
    setMessage("");

    // Send the form data to the API endpoint
    fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, conversationId }), // Include the conversationId in the payload
    });
  };

  // Handle image upload via Cloudinary
  const handleUpload = (result: any) => {
    // Send the uploaded image URL along with the conversation ID to the API
    fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: result?.info?.secure_url, // Access the secure URL from the Cloudinary upload result
        conversationId: conversationId, // Ensure conversationId is included
      }),
    });
  };

  // Handle emoji picker selection
  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji); // Append selected emoji to the message
    setValue("message", message + emoji, { shouldValidate: true }); // Update form value
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      {/* Cloudinary upload button */}
      <CldUploadButton
        options={{
          maxFiles: 1, // Restrict to 1 file per upload
          resourceType: "image", // Restrict to images only
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif"], // Allow specific image formats
        }}
        uploadPreset="acadrd0w" // Cloudinary upload preset
        onSuccess={handleUpload} // Handle successful upload
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>

      {/* Form for text message input */}
      <form
        className="flex items-center gap-2 lg:gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)} // Handle form submission
      >
        {/* Input field for message */}
        <MessageInput
          required
          placeholder="Write a message"
          id="message"
          register={register} // Registering the input field with react-hook-form
          errors={errors} // Pass any form validation errors
          value={message} // Bind to message state
          onChange={(e) => setMessage(e.target.value)} // Handle input changes
        />

        {/* Emoji picker */}
        <div className="cursor-pointer transition">
          <EmojiPicker onChange={handleEmojiSelect} />{" "}
          {/* Append emoji to message */}
        </div>

        {/* Submit button with paper airplane icon */}
        <button
          type="submit"
          disabled={isSubmitting} // Disable button while submitting
          className={`rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "" // Visual feedback for disabled state
          }`}
        >
          <HiPaperAirplane
            size={18}
            className="text-white"
            style={{ transform: "rotate(45deg)" }} // Rotate the icon to make it look like a send button
          />
        </button>
      </form>
    </div>
  );
};

export default Form;
