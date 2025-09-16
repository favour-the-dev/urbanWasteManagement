"use client";
import type React from "react";
import { createContext, useContext } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  role: "admin" | "operator";
  name: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || "",
        role: session.user.role as "admin" | "operator",
      }
    : null;

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const isLoading = status === "loading";

  return (
    <AuthContext.Provider value={{ user, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
