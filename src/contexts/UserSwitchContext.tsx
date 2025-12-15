import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface UserProfile {
  id: string;
  nome: string | null;
  email: string | null;
}

interface UserSwitchContextType {
  selectedUserId: string | null;
  selectedUserProfile: UserProfile | null;
  allUsers: UserProfile[];
  isLoadingUsers: boolean;
  switchUser: (userId: string) => void;
}

const UserSwitchContext = createContext<UserSwitchContextType | null>(null);

export function UserSwitchProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Fetch all users from profiles table
  useEffect(() => {
    async function fetchAllUsers() {
      setIsLoadingUsers(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, nome, email")
          .order("nome");

        if (error) throw error;
        setAllUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    }

    if (user) {
      fetchAllUsers();
    }
  }, [user]);

  // Set initial selected user to current auth user
  useEffect(() => {
    if (user && !selectedUserId) {
      setSelectedUserId(user.id);
    }
  }, [user, selectedUserId]);

  const selectedUserProfile = allUsers.find(u => u.id === selectedUserId) || null;

  const switchUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <UserSwitchContext.Provider
      value={{
        selectedUserId,
        selectedUserProfile,
        allUsers,
        isLoadingUsers,
        switchUser,
      }}
    >
      {children}
    </UserSwitchContext.Provider>
  );
}

export function useUserSwitch() {
  const context = useContext(UserSwitchContext);
  if (!context) {
    throw new Error("useUserSwitch must be used within a UserSwitchProvider");
  }
  return context;
}
