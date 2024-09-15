"use client"; // Required for components using hooks like useState and useEffect

import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { IoClose, IoPersonAdd, IoPersonRemove, IoTrash } from "react-icons/io5"; // Use IoPersonRemove for "Remove User"
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import Avatar from "./Avatar";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "./AvatarGroup";
import AddUserToGroupModal from "./AddUserToGroupModal";
import RemoveUserFromGroupModal from "./RemoveUserFromGroupModal";
import useActiveList from "@/hooks/useActiveList";
import useOtherUser from "@/hooks/useOtherUser";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
  users: User[];
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
  users,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [removeUser, setRemoveUser] = useState(false); // Updated state name for consistency
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Memoize values for performance
  const otherUser = useOtherUser(data);
  // const otherUser = useMemo(() => data.users[0], [data.users]); // Assuming first user is the other user
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  const joinedDate = useMemo(
    () => format(new Date(otherUser.createdAt), "PP"),
    [otherUser.createdAt]
  );
  const title = useMemo(
    () => data.name || otherUser.name,
    [data.name, otherUser.name]
  );
  const statusText = useMemo(
    () =>
      data.isGroup ? (
        `${data.users.length} members`
      ) : isActive ? (
        <div className="text-sky-500">Online</div>
      ) : (
        "Offline"
      ),
    [data, isActive]
  );

  return (
    <>
      <AddUserToGroupModal
        isOpen={addUser}
        onClose={() => setAddUser(false)}
        users={users}
        otherUsers={data}
      />
      <RemoveUserFromGroupModal
        isOpen={removeUser} // Corrected state usage
        onClose={() => setRemoveUser(false)}
        conversation={data}
      />
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col bg-white overflow-y-scroll py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-end">
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              onClick={onClose}
                              className="rounded-md bg-white text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                              <span className="sr-only">Close panel</span>
                              <IoClose size={24} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center">
                          <div className="mb-2">
                            {!data.isGroup ? (
                              <Avatar user={otherUser} />
                            ) : (
                              <AvatarGroup users={data.users} />
                            )}
                          </div>
                          <div>{title}</div>
                          <div className="text-sm text-gray-500">
                            {statusText}
                          </div>
                          {fetchError && <div>{fetchError}</div>}
                          <div className="flex gap-10 my-6">
                            {data.isGroup && (
                              <>
                                <div
                                  className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75 "
                                  onClick={() => setAddUser(true)}
                                >
                                  <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center">
                                    <IoPersonAdd size={20} />
                                  </div>
                                  <div className="text-sm font-light text-neutral-600">
                                    Add User
                                  </div>
                                </div>
                                <div
                                  className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75 "
                                  onClick={() => setRemoveUser(true)} // Corrected onClick for removing users
                                >
                                  <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center">
                                    <IoPersonRemove size={20} />{" "}
                                    {/* Updated icon for removing users */}
                                  </div>
                                  <div className="text-sm font-light text-neutral-600">
                                    Remove User
                                  </div>
                                </div>
                              </>
                            )}
                            <div
                              className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75 "
                              onClick={() => setConfirmOpen(true)}
                            >
                              <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center">
                                <IoTrash size={20} />
                              </div>
                              <div className="text-sm font-light text-neutral-600">
                                Delete
                              </div>
                            </div>
                          </div>

                          <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                            <dt className="space-y-4 px-4 sm:space-y-5 sm:px-6">
                              {data.isGroup && (
                                <div>
                                  <dt className="text-sm font-medium text-gray-500 sm:2-40 sm:flex-shrink-0">
                                    Emails
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                    {data.users
                                      .map((user) => user.email)
                                      .join(", ")}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <div>
                                  <dt className="text-sm font-medium sm:2-40 text-gray-500 sm:flex-shrink-0">
                                    Email
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                    {otherUser.email}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <>
                                  <hr />
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                      Joined
                                    </dt>
                                    <dd className="ml-1 text-sm text-gray-900 sm:col-span-2">
                                      <time dateTime={joinedDate}>
                                        {joinedDate}
                                      </time>
                                    </dd>
                                  </div>
                                </>
                              )}
                            </dt>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProfileDrawer;
