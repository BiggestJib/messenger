"use client"; // This ensures the component runs on the client-side (required for hooks like useState)

import { useRouter } from "next/navigation"; // Next.js router hook to handle navigation and page refreshes
import React, { useState } from "react"; // React import for state management
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"; // Form handling utilities from react-hook-form
import toast from "react-hot-toast"; // A library to display toast notifications
import Modal from "./Modal"; // Custom modal component
import Select from "./Select"; // Custom select component to choose users
import Button from "./Button"; // Custom button component
import { useConversation } from "@/hooks/useConversation"; // Custom hook to retrieve the current conversation ID
import { User } from "@prisma/client"; // Prisma type for user data
import { FullConversationType } from "@/app/types"; // Full conversation type with messages and users

// Defining the props that the RemoveUserFromGroupModal component will accept
interface RemoveUserFromGroupModalProps {
  isOpen?: boolean; // Optional boolean to indicate if the modal is open
  onClose: () => void; // Function to close the modal
  conversation: FullConversationType | { users: User[] }; // Full conversation object, including users
}

// Main component for removing users from a group conversation
const RemoveUserFromGroupModal: React.FC<RemoveUserFromGroupModalProps> = ({
  isOpen,
  onClose,
  conversation,
}) => {
  const { conversationId } = useConversation(); // Retrieves the conversation ID using a custom hook
  const router = useRouter(); // Router hook to refresh the page after user removal
  const [isLoading, setIsLoading] = useState(false); // State to track loading status during form submission

  // React Hook Form for handling the form and validations
  const {
    register,
    handleSubmit,
    setValue, // Used to set form values programmatically
    watch, // Watch form field values
    formState: { errors }, // Contains validation errors
  } = useForm<FieldValues>({
    defaultValues: { members: [] }, // Default value for the members field is an empty array
  });

  // Get the users already in the group to be shown as options for removal
  const existingUsers = conversation?.users || [];

  const members = watch("members"); // Watch the selected members field

  // Handle form submission to remove users from the group conversation
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true); // Set loading state to true when submission starts

    try {
      // Send requests to remove each selected user from the group
      await Promise.all(
        data.members.map(async (member: any) => {
          const response = await fetch(
            `/api/conversations/${conversationId}/remove-user`, // API endpoint to remove users from the conversation
            {
              method: "POST", // HTTP POST request
              body: JSON.stringify({ userId: member.value }), // Sending the user ID of the member to be removed
              headers: { "Content-Type": "application/json" }, // Content-Type header to specify JSON payload
            }
          );

          if (!response.ok) {
            throw new Error("Failed to remove user"); // Throw error if response is not successful
          }
        })
      );

      router.refresh(); // Refresh the page or component to reflect the updated conversation
      onClose(); // Close the modal after successful removal
      toast.success("User(s) removed successfully!"); // Show success toast notification
    } catch (error) {
      toast.error("Something went wrong"); // Show error toast notification in case of failure
    } finally {
      setIsLoading(false); // Set loading state to false once the process is done
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {" "}
      {/* Modal component to show form inside a modal dialog */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {" "}
        {/* Form submission handler */}
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Remove Users from Group
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Select users to remove from the group conversation.
            </p>

            <div className="mt-10 flex flex-col gap-y-8">
              <Select
                disabled={isLoading} // Disable the select field while the form is submitting
                label="Members" // Label for the select input
                options={existingUsers.map((user) => ({
                  value: user.id, // The user ID is used as the value
                  label: user.name, // The user name is shown as the label in the select field
                }))}
                onChange={
                  (value) =>
                    setValue("members", value, { shouldValidate: true }) // Update the members field in the form
                }
                value={members} // The current value of selected members
              />
            </div>
          </div>
        </div>
        <div className="flex mt-6 items-center gap-x-6 justify-end">
          <Button
            onClick={onClose} // Close button handler
            type="button"
            secondary
            disabled={isLoading} // Disable the button while the form is submitting
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !watch("members")}>
            Remove {/* Submit button for removing users */}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RemoveUserFromGroupModal;
