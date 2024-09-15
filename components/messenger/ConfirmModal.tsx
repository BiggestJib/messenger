"use client"; // Enables client-side rendering for the component
import { useConversation } from "@/hooks/useConversation"; // Custom hook to get current conversation data
import { useRouter } from "next/navigation"; // Router for navigation
import React, { useCallback, useState } from "react"; // React hooks
import toast from "react-hot-toast"; // For showing error/success notifications
import Modal from "./Modal"; // Custom Modal component
import { FiAlertTriangle } from "react-icons/fi"; // Warning icon for alert
import { DialogTitle } from "@headlessui/react"; // DialogTitle from Headless UI
import Button from "@/components/messenger/Button"; // Custom Button component

interface ConfirmModalProps {
  isOpen?: boolean; // Prop to control whether the modal is open
  onClose: () => void; // Function to close the modal
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter(); // Initialize Next.js router
  const { conversationId } = useConversation(); // Get conversation ID from custom hook
  const [isLoading, setIsLoading] = useState(false); // Loading state to disable buttons while deleting

  // Function to handle the delete action
  const onDelete = useCallback(() => {
    setIsLoading(true); // Set loading to true while performing delete
    fetch(`/api/conversations/${conversationId}`, {
      method: "DELETE", // Make a DELETE request to delete the conversation
    })
      .then(() => {
        onClose(); // Close the modal
        router.push(`/conversations`); // Navigate to the conversations list after deletion
        router.refresh(); // Refresh the page to update the conversation list
      })
      .catch(() => toast.error("Something went wrong")) // Show an error notification if the request fails
      .finally(() => setIsLoading(false)); // Set loading to false after the request finishes
  }, [conversationId, router, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        {/* Warning icon container */}
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle className="h-6 w-6 text-red-600" />{" "}
          {/* Warning icon */}
        </div>

        {/* Modal content */}
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <DialogTitle
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Delete Conversation
          </DialogTitle>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this conversation? <br /> This
              action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons for Delete and Cancel */}
      <div className="mt-5 gap-3 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button disabled={isLoading} danger onClick={onDelete}>
          {" "}
          {/* Delete button */}
          Delete
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          {" "}
          {/* Cancel button */}
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
