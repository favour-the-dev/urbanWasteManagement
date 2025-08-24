"use client";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Truck,
  Route,
} from "lucide-react";

interface User {
  email: string;
  role: string;
  name: string;
}

interface CollectionPoint {
  id: string;
  address: string;
  type: "residential" | "commercial" | "industrial";
  status: "pending" | "in-progress" | "completed" | "skipped" | "issue";
  estimatedTime: string;
  notes?: string;
  priority: "high" | "medium" | "low";
}

interface RouteDetails {
  id: string;
  name: string;
  district: string;
  status: "pending" | "in-progress" | "completed";
  progress: number;
  totalDistance: string;
  estimatedDuration: string;
  actualDuration?: string;
  startTime: string;
  collectionPoints: CollectionPoint[];
  optimized: boolean;
}

// Mock route data
const mockRoute: RouteDetails = {
  id: "RT001",
  name: "Downtown District A",
  district: "Downtown",
  status: "in-progress",
  progress: 67,
  totalDistance: "12.4 km",
  estimatedDuration: "4h 30m",
  actualDuration: "3h 15m",
  startTime: "8:00 AM",
  optimized: true,
  collectionPoints: [
    {
      id: "CP001",
      address: "123 Main St",
      type: "commercial",
      status: "completed",
      estimatedTime: "10 min",
      priority: "high",
    },
    {
      id: "CP002",
      address: "456 Oak Ave",
      type: "residential",
      status: "completed",
      estimatedTime: "8 min",
      priority: "medium",
    },
    {
      id: "CP003",
      address: "789 Pine St",
      type: "commercial",
      status: "completed",
      estimatedTime: "12 min",
      priority: "high",
    },
    {
      id: "CP004",
      address: "321 Elm Dr",
      type: "residential",
      status: "in-progress",
      estimatedTime: "6 min",
      priority: "low",
      notes: "Current location",
    },
    {
      id: "CP005",
      address: "654 Maple Ln",
      type: "industrial",
      status: "pending",
      estimatedTime: "15 min",
      priority: "high",
    },
    {
      id: "CP006",
      address: "987 Cedar St",
      type: "commercial",
      status: "pending",
      estimatedTime: "10 min",
      priority: "medium",
    },
  ],
};

export function OperatorAssignments() {
  const [user, setUser] = useState<User | null>(null);
  const [route, setRoute] = useState<RouteDetails>(mockRoute);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "operator") {
        router.push("/admin/dashboard");
        return;
      }
      setUser(parsedUser);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleBack = () => {
    router.push("/operator/dashboard");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "issue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "in-progress":
        return <Navigation className="h-4 w-4 text-blue-600" />;
      default:
        return <MapPin className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "commercial":
        return "bg-blue-100 text-blue-800";
      case "industrial":
        return "bg-purple-100 text-purple-800";
      case "residential":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Route className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">My Assignments</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Route</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {/* Route Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {route.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{route.district}</Badge>
                    {route.optimized && (
                      <Badge variant="outline">Optimized Route</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Progress
                    </div>
                    <div className="text-lg font-semibold">
                      {route.progress}%
                    </div>
                    <Progress value={route.progress} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Distance
                    </div>
                    <div className="text-lg font-semibold">
                      {route.totalDistance}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Duration
                    </div>
                    <div className="text-lg font-semibold">
                      {route.actualDuration || route.estimatedDuration}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Started</div>
                    <div className="text-lg font-semibold">
                      {route.startTime}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collection Points */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Collection Points ({route.collectionPoints.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {route.collectionPoints.map((point, index) => (
                    <div
                      key={point.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        point.status === "in-progress"
                          ? "bg-blue-50 border-blue-200"
                          : point.status === "completed"
                            ? "bg-green-50 border-green-200"
                            : "bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                          {index + 1}
                        </div>
                        {getStatusIcon(point.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-medium">{point.address}</div>
                          <Badge
                            variant={getPriorityColor(point.priority)}
                            className="text-xs"
                          >
                            {point.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getTypeColor(point.type)}`}
                          >
                            {point.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {point.estimatedTime}
                          </span>
                        </div>
                        {point.notes && (
                          <div className="text-sm text-blue-600 mt-1">
                            {point.notes}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <Badge
                          variant={
                            point.status === "completed"
                              ? "default"
                              : point.status === "in-progress"
                                ? "secondary"
                                : point.status === "issue"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {point.status === "in-progress"
                            ? "Current"
                            : point.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>No upcoming assignments scheduled</p>
                  <p className="text-sm">
                    New assignments will appear here when scheduled by dispatch
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Commercial South D",
                      date: "Yesterday",
                      efficiency: "98%",
                    },
                    {
                      name: "Residential West E",
                      date: "2 days ago",
                      efficiency: "95%",
                    },
                    {
                      name: "Industrial North F",
                      date: "3 days ago",
                      efficiency: "92%",
                    },
                  ].map((route, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{route.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {route.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {route.efficiency}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Efficiency
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
