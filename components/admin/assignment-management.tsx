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
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Users,
  RouteIcon,
  Clock,
  Calendar,
  UserCheck,
} from "lucide-react";

interface Assignment {
  id: string;
  routeId: string;
  routeName: string;
  operatorId: string;
  operatorName: string;
  district: string;
  status: "assigned" | "in-progress" | "completed" | "cancelled";
  priority: "high" | "medium" | "low";
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: string;
  actualDuration?: string;
  collectionPoints: number;
  completedPoints: number;
  progress: number;
  assignedBy: string;
  assignedAt: string;
  notes?: string;
}

interface Operator {
  id: string;
  name: string;
  status: "available" | "assigned" | "break" | "offline";
  experience: number;
  currentAssignments: number;
  maxAssignments: number;
  efficiency: number;
  completedToday: number;
}

interface Route {
  id: string;
  name: string;
  district: string;
  collectionPoints: number;
  estimatedDuration: string;
  priority: "high" | "medium" | "low";
  status: "available" | "assigned" | "in-progress" | "completed";
}

// Mock data
const mockAssignments: Assignment[] = [
  {
    id: "ASG001",
    routeId: "RT001",
    routeName: "Downtown District A",
    operatorId: "OP001",
    operatorName: "Mike Rodriguez",
    district: "Downtown",
    status: "in-progress",
    priority: "high",
    scheduledDate: "2024-01-15",
    scheduledTime: "08:00",
    estimatedDuration: "4h 30m",
    actualDuration: "3h 15m",
    collectionPoints: 18,
    completedPoints: 12,
    progress: 67,
    assignedBy: "Sarah Johnson",
    assignedAt: "2024-01-14 16:30",
    notes: "Priority route - complete before noon",
  },
  {
    id: "ASG002",
    routeId: "RT002",
    routeName: "Residential North B",
    operatorId: "OP002",
    operatorName: "Sarah Chen",
    district: "North",
    status: "assigned",
    priority: "medium",
    scheduledDate: "2024-01-16",
    scheduledTime: "09:00",
    estimatedDuration: "5h 15m",
    collectionPoints: 24,
    completedPoints: 0,
    progress: 0,
    assignedBy: "Sarah Johnson",
    assignedAt: "2024-01-15 10:15",
  },
  {
    id: "ASG003",
    routeId: "RT003",
    routeName: "Industrial East C",
    operatorId: "OP003",
    operatorName: "James Wilson",
    district: "East",
    status: "in-progress",
    priority: "high",
    scheduledDate: "2024-01-15",
    scheduledTime: "07:30",
    estimatedDuration: "6h 00m",
    actualDuration: "4h 30m",
    collectionPoints: 15,
    completedPoints: 7,
    progress: 47,
    assignedBy: "Sarah Johnson",
    assignedAt: "2024-01-14 14:20",
    notes: "Heavy industrial waste - use large truck",
  },
];

const mockOperators: Operator[] = [
  {
    id: "OP001",
    name: "Mike Rodriguez",
    status: "assigned",
    experience: 5,
    currentAssignments: 1,
    maxAssignments: 2,
    efficiency: 94,
    completedToday: 1,
  },
  {
    id: "OP002",
    name: "Sarah Chen",
    status: "assigned",
    experience: 3,
    currentAssignments: 1,
    maxAssignments: 2,
    efficiency: 87,
    completedToday: 0,
  },
  {
    id: "OP003",
    name: "James Wilson",
    status: "assigned",
    experience: 7,
    currentAssignments: 1,
    maxAssignments: 3,
    efficiency: 92,
    completedToday: 0,
  },
  {
    id: "OP004",
    name: "Lisa Park",
    status: "available",
    experience: 4,
    currentAssignments: 0,
    maxAssignments: 2,
    efficiency: 89,
    completedToday: 2,
  },
  {
    id: "OP005",
    name: "David Kim",
    status: "available",
    experience: 2,
    currentAssignments: 0,
    maxAssignments: 1,
    efficiency: 78,
    completedToday: 1,
  },
  {
    id: "OP006",
    name: "Maria Garcia",
    status: "available",
    experience: 6,
    currentAssignments: 0,
    maxAssignments: 3,
    efficiency: 96,
    completedToday: 1,
  },
];

const mockRoutes: Route[] = [
  {
    id: "RT005",
    name: "Commercial West E",
    district: "West",
    collectionPoints: 16,
    estimatedDuration: "3h 45m",
    priority: "medium",
    status: "available",
  },
  {
    id: "RT006",
    name: "Residential South F",
    district: "South",
    collectionPoints: 22,
    estimatedDuration: "4h 15m",
    priority: "low",
    status: "available",
  },
  {
    id: "RT007",
    name: "Mixed Central G",
    district: "Central",
    collectionPoints: 20,
    estimatedDuration: "5h 00m",
    priority: "high",
    status: "available",
  },
];

interface User {
  email: string;
  role: string;
  name: string;
}

export function AssignmentManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [operators, setOperators] = useState<Operator[]>(mockOperators);
  const [routesData, setRoutesData] = useState<Route[]>(mockRoutes);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
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

  const handleCreateAssignment = (formData: FormData) => {
    const selectedRoute = routesData.find(
      (r) => r.id === formData.get("routeId")
    );
    const selectedOperator = operators.find(
      (o) => o.id === formData.get("operatorId")
    );

    if (selectedRoute && selectedOperator) {
      const newAssignment: Assignment = {
        id: `ASG${String(assignments.length + 1).padStart(3, "0")}`,
        routeId: selectedRoute.id,
        routeName: selectedRoute.name,
        operatorId: selectedOperator.id,
        operatorName: selectedOperator.name,
        district: selectedRoute.district,
        status: "assigned",
        priority: formData.get("priority") as "high" | "medium" | "low",
        scheduledDate: formData.get("scheduledDate") as string,
        scheduledTime: formData.get("scheduledTime") as string,
        estimatedDuration: selectedRoute.estimatedDuration,
        collectionPoints: selectedRoute.collectionPoints,
        completedPoints: 0,
        progress: 0,
        assignedBy: user?.name || "Admin",
        assignedAt: new Date().toLocaleString(),
        notes: (formData.get("notes") as string) || undefined,
      };

      setAssignments([...assignments, newAssignment]);

      // Update operator status
      setOperators(
        operators.map((op) =>
          op.id === selectedOperator.id
            ? {
                ...op,
                currentAssignments: op.currentAssignments + 1,
                status:
                  op.currentAssignments + 1 >= op.maxAssignments
                    ? "assigned"
                    : "available",
              }
            : op
        )
      );

      // Update route status
      setRoutesData(
        routesData.map((route) =>
          route.id === selectedRoute.id
            ? { ...route, status: "assigned" }
            : route
        )
      );
    }

    setIsCreateDialogOpen(false);
  };

  const handleReassignAssignment = (
    assignmentId: string,
    newOperatorId: string
  ) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    const newOperator = operators.find((o) => o.id === newOperatorId);

    if (assignment && newOperator) {
      setAssignments(
        assignments.map((a) =>
          a.id === assignmentId
            ? {
                ...a,
                operatorId: newOperator.id,
                operatorName: newOperator.name,
              }
            : a
        )
      );

      // Update operator assignments
      setOperators(
        operators.map((op) => {
          if (op.id === assignment.operatorId) {
            return { ...op, currentAssignments: op.currentAssignments - 1 };
          }
          if (op.id === newOperator.id) {
            return { ...op, currentAssignments: op.currentAssignments + 1 };
          }
          return op;
        })
      );
    }
  };

  const handleCancelAssignment = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      setAssignments(
        assignments.map((a) =>
          a.id === assignmentId ? { ...a, status: "cancelled" } : a
        )
      );

      // Update operator and route status
      setOperators(
        operators.map((op) =>
          op.id === assignment.operatorId
            ? {
                ...op,
                currentAssignments: Math.max(0, op.currentAssignments - 1),
              }
            : op
        )
      );

      setRoutesData(
        routesData.map((route) =>
          route.id === assignment.routeId
            ? { ...route, status: "available" }
            : route
        )
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "secondary";
      case "in-progress":
        return "default";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
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

  const getOperatorWorkload = (operator: Operator) => {
    return Math.round(
      (operator.currentAssignments / operator.maxAssignments) * 100
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card border-transparent">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Assignment Management</h1>
            </div>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
              </DialogHeader>
              <form action={handleCreateAssignment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="routeId">Select Route</Label>
                  <Select name="routeId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose available route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routesData
                        .filter((r) => r.status === "available")
                        .map((route) => (
                          <SelectItem key={route.id} value={route.id}>
                            {route.name} - {route.district} (
                            {route.collectionPoints} points)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatorId">Assign to Operator</Label>
                  <Select name="operatorId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators
                        .filter(
                          (op) => op.currentAssignments < op.maxAssignments
                        )
                        .map((operator) => (
                          <SelectItem key={operator.id} value={operator.id}>
                            {operator.name} ({operator.currentAssignments}/
                            {operator.maxAssignments} assignments,{" "}
                            {operator.efficiency}% efficiency)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Date</Label>
                    <Input
                      id="scheduledDate"
                      name="scheduledDate"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Time</Label>
                    <Input
                      id="scheduledTime"
                      name="scheduledTime"
                      type="time"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Set priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    name="notes"
                    placeholder="Special instructions or notes"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create Assignment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assignments">Active Assignments</TabsTrigger>
            <TabsTrigger value="operators">Operator Workload</TabsTrigger>
            <TabsTrigger value="history">Assignment History</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-6">
            <div className="grid gap-6">
              {assignments
                .filter((a) => a.status !== "cancelled")
                .map((assignment) => (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <CardTitle className="text-lg">
                              {assignment.routeName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Assigned to {assignment.operatorName} •{" "}
                              {assignment.district} District
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getPriorityColor(assignment.priority)}
                          >
                            {assignment.priority}
                          </Badge>
                          <Badge variant={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Scheduled
                          </div>
                          <div className="text-sm font-medium">
                            {new Date(
                              assignment.scheduledDate
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.scheduledTime}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <RouteIcon className="h-4 w-4" />
                            Progress
                          </div>
                          <div className="text-sm font-medium">
                            {assignment.completedPoints}/
                            {assignment.collectionPoints}
                          </div>
                          <Progress
                            value={assignment.progress}
                            className="w-full h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Duration
                          </div>
                          <div className="text-sm font-medium">
                            {assignment.actualDuration ||
                              assignment.estimatedDuration}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Est: {assignment.estimatedDuration}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            Assigned By
                          </div>
                          <div className="text-sm font-medium">
                            {assignment.assignedBy}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {assignment.assignedAt}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Select
                            onValueChange={(value) =>
                              handleReassignAssignment(assignment.id, value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Reassign" />
                            </SelectTrigger>
                            <SelectContent>
                              {operators
                                .filter(
                                  (op) =>
                                    op.id !== assignment.operatorId &&
                                    op.currentAssignments < op.maxAssignments
                                )
                                .map((operator) => (
                                  <SelectItem
                                    key={operator.id}
                                    value={operator.id}
                                  >
                                    {operator.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCancelAssignment(assignment.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {assignment.notes && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <div className="text-sm font-medium mb-1">Notes:</div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.notes}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="operators" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {operators.map((operator) => (
                <Card key={operator.id}>
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
                            : "secondary"
                        }
                      >
                        {operator.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Workload</span>
                        <span>
                          {operator.currentAssignments}/
                          {operator.maxAssignments}
                        </span>
                      </div>
                      <Progress
                        value={getOperatorWorkload(operator)}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Efficiency</div>
                        <div className="font-medium text-green-600">
                          {operator.efficiency}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">
                          Completed Today
                        </div>
                        <div className="font-medium">
                          {operator.completedToday}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        disabled={
                          operator.currentAssignments >= operator.maxAssignments
                        }
                      >
                        Assign Route
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

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment ID</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Efficiency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">
                          {assignment.id}
                        </TableCell>
                        <TableCell>{assignment.routeName}</TableCell>
                        <TableCell>{assignment.operatorName}</TableCell>
                        <TableCell>
                          {new Date(
                            assignment.scheduledDate
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {assignment.actualDuration ||
                            assignment.estimatedDuration}
                        </TableCell>
                        <TableCell>
                          {assignment.status === "completed" ? (
                            <span className="text-green-600 font-medium">
                              98%
                            </span>
                          ) : assignment.status === "in-progress" ? (
                            <span className="text-blue-600 font-medium">
                              {assignment.progress}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
