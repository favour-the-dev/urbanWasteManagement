"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Truck, Shield } from "lucide-react";
import { User } from "@/app/context/auth-context";
import { useAuth } from "@/app/context/auth-context";

// Mock user data - in a real app, this would come from a database
const mockUsers: User[] = [
  {
    email: "admin@city.gov",
    password: "admin123",
    role: "admin",
    name: "Sarah Johnson",
  },
  {
    email: "operator@city.gov",
    password: "operator123",
    role: "operator",
    name: "Mike Rodriguez",
  },
];

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleDemoSelect = (role: "admin" | "operator") => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      login(user);
      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/operator/dashboard");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      login(user);

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/operator/dashboard");
      }
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full border-gray-300">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="text-sm text-muted-foreground text-center">
            Demo Accounts:
          </div>
          <div className="grid gap-2">
            <div
              onClick={() => handleDemoSelect("admin")}
              className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm cursor-pointer"
            >
              <Shield className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">Admin: admin@city.gov</div>
                <div className="text-muted-foreground">Password: admin123</div>
              </div>
            </div>
            <div
              onClick={() => handleDemoSelect("operator")}
              className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm cursor-pointer"
            >
              <Truck className="h-4 w-4 text-secondary" />
              <div>
                <div className="font-medium">Operator: operator@city.gov</div>
                <div className="text-muted-foreground">
                  Password: operator123
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
