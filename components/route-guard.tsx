"use client";
import type React from "react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "operator";
  redirectTo?: string;
}

export function RouteGuard({
  children,
  requiredRole,
  redirectTo = "/",
}: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.error("no user");
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user.role === requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const dashboardPath =
          user.role === "admin" ? "/admin/dashboard" : "/operator/dashboard";
        router.push(dashboardPath);
        return;
      }
    }
  }, [user, isLoading, requiredRole, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
