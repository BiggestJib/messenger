import { create } from "zustand";

// Define the interface for the store's state and actions
interface ActiveListStore {
  members: string[]; // The array of active members (strings)
  add: (id: string) => void; // Function to add a member
  remove: (id: string) => void; // Function to remove a member by ID
  set: (ids: string[]) => void; // Function to replace the entire list of members
}

// Create the Zustand store using the interface
const useActiveList = create<ActiveListStore>((set) => ({
  members: [], // Initial state: an empty array of members

  // Add a member ID to the list
  add: (id) =>
    set((state) => ({
      members: [...state.members, id], // Spread the current members and add the new one
    })),

  // Remove a member ID from the list
  remove: (id) =>
    set((state) => ({
      members: state.members.filter((memberId) => memberId !== id), // Filter out the member to remove
    })),

  // Replace the entire members array with a new one
  set: (ids) => set({ members: ids }),
}));

export default useActiveList;
