"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type React from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "operator";
  redirectTo?: string;
}

export function RouteGuard({
  children,
  requiredRole,
  redirectTo = "/login",
}: RouteGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    // Not authenticated
    if (!session) {
      router.push(redirectTo);
      return;
    }

    // Check role requirement
    if (requiredRole && session.user.role !== requiredRole) {
      // Redirect based on user role
      if (session.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/operator/dashboard");
      }
      return;
    }
  }, [session, status, requiredRole, redirectTo, router]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return null;
  }

  // Role mismatch
  if (requiredRole && session.user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
