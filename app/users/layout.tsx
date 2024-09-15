import getUsers from "@/actions/getUsers";
import Sidebar from "@/components/messenger/Sidebar";
import UserList from "@/components/messenger/UserList";
import React from "react";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    //@ts-expect-errror Server Component
    <Sidebar>
      <UserList items={users} />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
