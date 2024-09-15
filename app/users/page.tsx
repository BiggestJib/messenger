import React from "react";
import EmptyState from "@/components/messenger/EmptyState";

const Users = () => {
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState></EmptyState>
    </div>
  );
};

export default Users;
