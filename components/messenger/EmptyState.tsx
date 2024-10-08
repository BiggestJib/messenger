import React from "react";

const EmptyState = () => {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-6 h-full flex justify-center items-center bg-gray-100">
      <div className="text-center items center flex flex-col">
        <h3 className="mt-2 font-semibold text-gray-900 text-2xl">
          Select a chat or start a new conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
