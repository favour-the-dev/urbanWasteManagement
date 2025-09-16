"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouteOptimizerComponent } from "./route-optimzer";
import {
  Users,
  MapPin,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Navigation,
  Clock,
  Zap,
  Calendar,
} from "lucide-react";
import type { OptimizedRoute } from "@/lib/dijkstra";

interface Route {
  id: string;
  name: string;
  district: string;
  operator: string;
  status: "active" | "scheduled" | "completed" | "delayed";
  progress: number;
  estimatedTime: string;
  actualTime?: string;
  collectionPoints: number;
  completedPoints: number;
  priority: "high" | "medium" | "low";
  scheduledDate: string;
  optimized: boolean;
}

interface Operator {
  id: string;
  name: string;
  status: "available" | "assigned" | "break" | "offline";
  currentRoute?: string;
  experience: number;
}

// Mock data
const mockRoutes: Route[] = [
  {
    id: "RT001",
    name: "Downtown District A",
    district: "Downtown",
    operator: "Mike Rodriguez",
    status: "active",
    progress: 67,
    estimatedTime: "4h 30m",
    actualTime: "3h 15m",
    collectionPoints: 18,
    completedPoints: 12,
    priority: "high",
    scheduledDate: "2024-01-15",
    optimized: true,
  },
  {
    id: "RT002",
    name: "Residential North B",
    district: "North",
    operator: "Sarah Chen",
    status: "scheduled",
    progress: 0,
    estimatedTime: "5h 15m",
    collectionPoints: 24,
    completedPoints: 0,
    priority: "medium",
    scheduledDate: "2024-01-16",
    optimized: true,
  },
  {
    id: "RT003",
    name: "Industrial East C",
    district: "East",
    operator: "James Wilson",
    status: "delayed",
    progress: 45,
    estimatedTime: "6h 00m",
    actualTime: "4h 30m",
    collectionPoints: 15,
    completedPoints: 7,
    priority: "high",
    scheduledDate: "2024-01-15",
    optimized: false,
  },
  {
    id: "RT004",
    name: "Commercial South D",
    district: "South",
    operator: "Lisa Park",
    status: "completed",
    progress: 100,
    estimatedTime: "3h 45m",
    actualTime: "3h 20m",
    collectionPoints: 12,
    completedPoints: 12,
    priority: "low",
    scheduledDate: "2024-01-15",
    optimized: true,
  },
];

const mockOperators: Operator[] = [
  {
    id: "OP001",
    name: "Mike Rodriguez",
    status: "assigned",
    currentRoute: "RT001",
    experience: 5,
  },
  { id: "OP002", name: "Sarah Chen", status: "available", experience: 3 },
  {
    id: "OP003",
    name: "James Wilson",
    status: "assigned",
    currentRoute: "RT003",
    experience: 7,
  },
  { id: "OP004", name: "Lisa Park", status: "break", experience: 4 },
  { id: "OP005", name: "David Kim", status: "available", experience: 2 },
  { id: "OP006", name: "Maria Garcia", status: "available", experience: 6 },
];

interface User {
  email: string;
  role: string;
  name: string;
}

export function RouteManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [operators, setOperators] = useState<Operator[]>(mockOperators);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        router.push("/operator/dashboard");
        return;
      }
      setUser(parsedUser);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleBack = () => {
    router.push("/admin/dashboard");
  };

  const handleOptimizeRoute = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    if (route) {
      setSelectedRoute(route);
      setShowOptimizer(true);
    }
  };

  const handleOptimizationComplete = (result: OptimizedRoute) => {
    if (selectedRoute) {
      setRoutes(
        routes.map((route) =>
          route.id === selectedRoute.id
            ? {
                ...route,
                optimized: true,
                estimatedTime: `${Math.floor(result.totalTime / 60)}h ${result.totalTime % 60}m`,
              }
            : route
        )
      );
      setShowOptimizer(false);
      setSelectedRoute(null);
    }
  };

  const handleCreateRoute = (formData: FormData) => {
    const newRoute: Route = {
      id: `RT${String(routes.length + 1).padStart(3, "0")}`,
      name: formData.get("name") as string,
      district: formData.get("district") as string,
      operator: formData.get("operator") as string,
      status: "scheduled",
      progress: 0,
      estimatedTime: formData.get("estimatedTime") as string,
      collectionPoints: Number.parseInt(
        formData.get("collectionPoints") as string
      ),
      completedPoints: 0,
      priority: formData.get("priority") as "high" | "medium" | "low",
      scheduledDate: formData.get("scheduledDate") as string,
      optimized: false,
    };
    setRoutes([...routes, newRoute]);
    setIsCreateDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "completed":
        return "bg-gray-500";
      case "delayed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-b-gray-200 bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Navigation className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Route Management</h1>
            </div>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Route</DialogTitle>
              </DialogHeader>
              <form action={handleCreateRoute} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Route Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Downtown District A"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select name="district" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Downtown">Downtown</SelectItem>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operator">Assign Operator</Label>
                  <Select name="operator" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators
                        .filter((op) => op.status === "available")
                        .map((operator) => (
                          <SelectItem key={operator.id} value={operator.name}>
                            {operator.name} ({operator.experience}y exp)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="collectionPoints">Collection Points</Label>
                    <Input
                      id="collectionPoints"
                      name="collectionPoints"
                      type="number"
                      placeholder="24"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedTime">Est. Time</Label>
                    <Input
                      id="estimatedTime"
                      name="estimatedTime"
                      placeholder="4h 30m"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input
                      id="scheduledDate"
                      name="scheduledDate"
                      type="date"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Create Route
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="routes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="routes">Active Routes</TabsTrigger>
            <TabsTrigger value="optimizer">Route Optimizer</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="operators">Operators</TabsTrigger>
          </TabsList>

          <TabsContent value="routes" className="space-y-6">
            <div className="grid gap-6">
              {routes.map((route) => (
                <Card key={route.id} className="relative border-transparent">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(route.status)}`}
                        />
                        <div>
                          <CardTitle className="text-lg">
                            {route.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {route.district} District • {route.operator}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(route.priority)}>
                          {route.priority}
                        </Badge>
                        <Badge variant="outline">{route.status}</Badge>
                        {route.optimized && (
                          <Badge variant="secondary">
                            <Zap className="h-3 w-3 mr-1" />
                            Optimized
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          Collection Points
                        </div>
                        <div className="text-lg font-semibold">
                          {route.completedPoints}/{route.collectionPoints}
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${route.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Time
                        </div>
                        <div className="text-lg font-semibold">
                          {route.actualTime || route.estimatedTime}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Est: {route.estimatedTime}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Scheduled
                        </div>
                        <div className="text-lg font-semibold">
                          {new Date(route.scheduledDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!route.optimized && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOptimizeRoute(route.id)}
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Optimize
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="optimizer" className="space-y-6">
            <RouteOptimizerComponent
              collectionPoints={["cp1", "cp2", "cp3", "cp4", "cp5", "cp6"]}
              onOptimizationComplete={handleOptimizationComplete}
            />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="border-transparent">
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell>
                          {new Date(route.scheduledDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {route.name}
                        </TableCell>
                        <TableCell>{route.operator}</TableCell>
                        <TableCell>{route.district}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              route.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {route.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operators" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {operators.map((operator) => (
                <Card key={operator.id} className="border-transparent">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-base">
                            {operator.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {operator.experience} years experience
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          operator.status === "available"
                            ? "default"
                            : operator.status === "assigned"
                              ? "secondary"
                              : operator.status === "break"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {operator.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {operator.currentRoute && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Current Route:{" "}
                        </span>
                        <span className="font-medium">
                          {operator.currentRoute}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                      >
                        Assign
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Route Optimization Dialog */}
        <Dialog open={showOptimizer} onOpenChange={setShowOptimizer}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Optimize Route: {selectedRoute?.name}</DialogTitle>
            </DialogHeader>
            <RouteOptimizerComponent
              collectionPoints={["cp1", "cp2", "cp3", "cp4", "cp5", "cp6"]}
              onOptimizationComplete={handleOptimizationComplete}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
