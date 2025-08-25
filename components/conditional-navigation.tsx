"use client";
import { useAuth } from "@/app/context/auth-context";
import { usePathname } from "next/navigation";
import { Navigation } from "./navigation";

export function ConditionalNavigation() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  // Don't show navigation on auth pages or while loading
  const isAuthPage = pathname?.startsWith("/login") || pathname === "/";

  if (isLoading || !user || isAuthPage) {
    return null;
  }

  return <Navigation />;
}
