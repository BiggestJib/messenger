import { useEffect, useState } from "react";
import useActiveList from "./useActiveList"; // Zustand store for managing active members
import { Channel, Members } from "pusher-js"; // Pusher.js types for channel and member management
import { pusherClient } from "@/libs/pusher"; // Pusher client instance

const useActiveChannel = () => {
  // Get Zustand store methods for managing members (set, add, remove)
  const { set, add, remove } = useActiveList();

  // State to track the active Pusher channel (initialized as null)
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel; // Get the current active channel

    // If there is no active channel, subscribe to the presence-messenger channel
    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel); // Set the active channel in the state
    }

    // Bind the 'subscription_succeeded' event, which is triggered when the channel subscription is successful
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = []; // Array to store the initial list of members

      // Loop through each member in the presence channel and add them to the list
      members.each((member: Record<string, any>) => {
        initialMembers.push(member.id);
      });
      // Use Zustand's `set` method to update the list of members in the store
      set(initialMembers);

      // Bind the 'member_added' event, which is triggered when a new member joins the channel
      channel.bind("pusher:member_added", (member: Record<string, any>) => {
        add(member.id); // Add the new member's ID to the active list using Zustand's `add` method
      });

      // Bind the 'member_removed' event, which is triggered when a member leaves the channel
      channel.bind("pusher:member_removed", (member: Record<string, any>) => {
        remove(member.id); // Remove the member's ID from the active list using Zustand's `remove` method
      });
    });

    // Cleanup function to unsubscribe from the channel and reset the active channel state
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger"); // Unsubscribe from the channel when the component unmounts
        setActiveChannel(null); // Reset the active channel state to null
      }
    };
  }, [activeChannel, set, add, remove]); // Dependency array ensures the effect runs when any of these dependencies change
};

export default useActiveChannel;
