"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  LogOut,
  Navigation,
  AlertCircle,
  Play,
  Pause,
  Flag,
  MessageSquare,
  Camera,
} from "lucide-react";

interface User {
  email: string;
  role: string;
  name: string;
}

interface Assignment {
  id: string;
  routeName: string;
  district: string;
  status: "pending" | "in-progress" | "completed" | "paused";
  progress: number;
  totalStops: number;
  completedStops: number;
  estimatedTime: string;
  startTime?: string;
  currentLocation?: string;
  nextStop: string;
  priority: "high" | "medium" | "low";
}

// Mock assignment data
const mockAssignment: Assignment = {
  id: "RT001",
  routeName: "Downtown District A",
  district: "Downtown",
  status: "in-progress",
  progress: 67,
  totalStops: 18,
  completedStops: 12,
  estimatedTime: "4h 30m",
  startTime: "8:00 AM",
  currentLocation: "Main St & 3rd Ave",
  nextStop: "City Hall - 123 Government St",
  priority: "high",
};

export default function OperatorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [assignment, setAssignment] = useState<Assignment>(mockAssignment);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [routeStatus, setRouteStatus] = useState<"running" | "paused">(
    "running"
  );
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleNavigateToAssignments = () => {
    router.push("/operator/assignments");
  };

  const handleToggleRoute = () => {
    setRouteStatus(routeStatus === "running" ? "paused" : "running");
    setAssignment({
      ...assignment,
      status: routeStatus === "running" ? "paused" : "in-progress",
    });
  };

  const handleCompleteStop = () => {
    const newCompleted = assignment.completedStops + 1;
    const newProgress = Math.round(
      (newCompleted / assignment.totalStops) * 100
    );

    setAssignment({
      ...assignment,
      completedStops: newCompleted,
      progress: newProgress,
      status:
        newCompleted === assignment.totalStops ? "completed" : "in-progress",
    });
  };

  const handleReportIssue = (formData: FormData) => {
    // In a real app, this would send the report to the backend
    console.log("Issue reported:", {
      type: formData.get("issueType"),
      description: formData.get("description"),
      location: assignment.currentLocation,
    });
    setIsReportDialogOpen(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Current Assignment Status */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                {assignment.routeName}
              </CardTitle>
              <Badge
                variant={
                  assignment.priority === "high" ? "destructive" : "secondary"
                }
              >
                {assignment.priority} priority
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Route Progress</span>
              <span className="text-sm text-muted-foreground">
                {assignment.completedStops} of {assignment.totalStops} stops
              </span>
            </div>
            <Progress value={assignment.progress} className="w-full h-3" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Started: {assignment.startTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>ETA: 2:30 PM</span>
              </div>
            </div>

            {assignment.status !== "completed" && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">Next Stop:</div>
                <div className="text-sm text-muted-foreground">
                  {assignment.nextStop}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          {assignment.status !== "completed" && (
            <>
              <Button
                onClick={handleToggleRoute}
                variant={routeStatus === "running" ? "secondary" : "default"}
                className="h-16 text-base"
              >
                {routeStatus === "running" ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause Route
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Resume Route
                  </>
                )}
              </Button>

              <Button
                onClick={handleCompleteStop}
                disabled={routeStatus === "paused"}
                className="h-16 text-base"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete Stop
              </Button>
            </>
          )}

          {assignment.status === "completed" && (
            <div className="col-span-2">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-semibold text-green-800">
                      Route Completed!
                    </div>
                    <div className="text-sm text-green-600">
                      All collection points have been serviced
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Today
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignment.completedStops}
              </div>
              <p className="text-xs text-muted-foreground">Collection points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignment.totalStops - assignment.completedStops}
              </div>
              <p className="text-xs text-muted-foreground">Collection points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">On schedule</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                View All Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                See your complete route details, collection points, and
                navigation information.
              </p>
              <Button onClick={handleNavigateToAssignments} className="w-full">
                View Detailed Routes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Report Issue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Report problems, blocked routes, or equipment issues to
                dispatch.
              </p>
              <Dialog
                open={isReportDialogOpen}
                onOpenChange={setIsReportDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Report Problem
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Report Issue</DialogTitle>
                  </DialogHeader>
                  <form action={handleReportIssue} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="issueType">Issue Type</Label>
                      <Select name="issueType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blocked_access">
                            Blocked Access
                          </SelectItem>
                          <SelectItem value="equipment_failure">
                            Equipment Failure
                          </SelectItem>
                          <SelectItem value="safety_hazard">
                            Safety Hazard
                          </SelectItem>
                          <SelectItem value="route_issue">
                            Route Issue
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the issue in detail..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Current Location:</strong>{" "}
                      {assignment.currentLocation}
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Submit Report
                      </Button>
                      <Button type="button" variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
