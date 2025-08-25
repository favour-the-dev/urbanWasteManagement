"use client";
import { useAuth } from "@/app/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Home,
  Route,
  Users,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export function Navigation() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // This component should only be rendered when user exists, but add safety check
  if (!user) return null;

  const isAdmin = user.role === "admin";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Desktop Navigation */}
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-primary">WasteFlow</h1>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href={isAdmin ? "/admin/dashboard" : "/operator/dashboard"}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            {isAdmin ? (
              <>
                <Link href="/admin/route">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Route className="h-4 w-4" />
                    Routes
                  </Button>
                </Link>
                <Link href="/admin/assignments">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Assignments
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/operator/assignments">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ClipboardList className="h-4 w-4" />
                  My Assignments
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop User Info and Logout */}
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {user.name} ({user.role})
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Mobile User Info and Menu Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <div className="text-right">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.role}</div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="p-2">
            <LogOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <Menu className="h-8 w-8" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 mt-3 pt-3">
          <div className="flex flex-col space-y-2">
            <Link
              href={isAdmin ? "/admin/dashboard" : "/operator/dashboard"}
              onClick={closeMobileMenu}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            {isAdmin ? (
              <>
                <Link href="/admin/route" onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start flex items-center gap-2"
                  >
                    <Route className="h-4 w-4" />
                    Routes
                  </Button>
                </Link>
                <Link href="/admin/assignments" onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Assignments
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/operator/assignments" onClick={closeMobileMenu}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start flex items-center gap-2"
                >
                  <ClipboardList className="h-4 w-4" />
                  My Assignments
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
