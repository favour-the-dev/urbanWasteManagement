"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  Users,
  MapPin,
  BarChart3,
  LogOut,
  Route,
  AlertTriangle,
  TrendingUp,
  Settings,
  Bell,
  CheckCircle,
  XCircle,
  Activity,
  UserCheck,
} from "lucide-react";

interface User {
  email: string;
  role: string;
  name: string;
}

// Mock data for demonstration
const mockData = {
  routes: {
    active: 24,
    completed: 18,
    delayed: 3,
    efficiency: 92,
  },
  operators: {
    total: 18,
    active: 16,
    onBreak: 2,
    offline: 0,
  },
  collections: {
    today: 342,
    completed: 298,
    remaining: 44,
    completionRate: 87,
  },
  issues: {
    total: 5,
    critical: 1,
    medium: 2,
    low: 2,
    resolved: 12,
  },
};

const recentActivity = [
  {
    id: 1,
    type: "route_completed",
    message: "Route DT-A12 completed by Mike Rodriguez",
    time: "2 min ago",
    status: "success",
  },
  {
    id: 2,
    type: "issue_reported",
    message: "Blocked access reported at Pine St & 5th Ave",
    time: "8 min ago",
    status: "warning",
  },
  {
    id: 3,
    type: "operator_break",
    message: "Sarah Chen started break - Route DT-B05",
    time: "15 min ago",
    status: "info",
  },
  {
    id: 4,
    type: "route_optimized",
    message: "Route optimization completed for District C",
    time: "23 min ago",
    status: "success",
  },
  {
    id: 5,
    type: "issue_resolved",
    message: "Equipment malfunction resolved - Truck #247",
    time: "1 hour ago",
    status: "success",
  },
];

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleNavigateToRoutes = () => {
    router.push("/admin/routes");
  };

  const handleNavigateToAssignments = () => {
    router.push("/admin/assignments");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-center md:text-start">
            Operations Command Center
          </h2>
          <p className="text-muted-foreground text-center md:text-start">
            Real-time monitoring and management of waste collection operations
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-5 md:grid-cols-3 place-content-center my-6 md:my-3 py-6 md:py-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-gray-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Routes
                  </CardTitle>
                  <Route className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockData.routes.active}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span>{mockData.routes.efficiency}% efficiency</span>
                  </div>
                  <Progress
                    value={mockData.routes.efficiency}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Field Operators
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockData.operators.active}
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {mockData.operators.active} active
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      {mockData.operators.onBreak} break
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Collections Today
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockData.collections.completed}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of {mockData.collections.today} scheduled
                  </div>
                  <Progress
                    value={mockData.collections.completionRate}
                    className="mt-2"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="border-gray-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              activity.status === "success"
                                ? "bg-green-500"
                                : activity.status === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {activity.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-gray-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleNavigateToRoutes}
                      className="w-full justify-start"
                    >
                      <Route className="h-4 w-4 mr-2" />
                      Manage Routes
                    </Button>
                    <Button
                      onClick={handleNavigateToAssignments}
                      variant="outline"
                      className="w-full justify-start bg-transparent border-gray-300"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Manage Assignments
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent border-gray-300"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-gray-100">
                <CardHeader>
                  <CardTitle>Live Route Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        route: "DT-A12",
                        operator: "Mike Rodriguez",
                        progress: 85,
                        status: "On Track",
                      },
                      {
                        route: "DT-B05",
                        operator: "Sarah Chen",
                        progress: 45,
                        status: "Break",
                      },
                      {
                        route: "DT-C08",
                        operator: "James Wilson",
                        progress: 92,
                        status: "Delayed",
                      },
                      {
                        route: "DT-D15",
                        operator: "Lisa Park",
                        progress: 67,
                        status: "On Track",
                      },
                    ].map((route) => (
                      <div
                        key={route.route}
                        className="flex items-center justify-between p-3 border border-gray-300 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{route.route}</div>
                          <div className="text-sm text-muted-foreground">
                            {route.operator}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {route.progress}%
                          </div>
                          <Badge
                            variant={
                              route.status === "On Track"
                                ? "default"
                                : route.status === "Break"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {route.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Daily Target</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Route Efficiency</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Operator Utilization</span>
                        <span>89%</span>
                      </div>
                      <Progress value={89} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Issue Resolution</span>
                        <span>95%</span>
                      </div>
                      <Progress value={95} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-gray-100">
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Analytics charts would be implemented here</p>
                    <p className="text-sm">
                      Integration with charting library needed
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-100">
                <CardHeader>
                  <CardTitle>Route Optimization Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fuel Savings</span>
                      <span className="font-medium text-green-600">+15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Time Reduction</span>
                      <span className="font-medium text-green-600">+22%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Coverage Improvement</span>
                      <span className="font-medium text-green-600">+8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
