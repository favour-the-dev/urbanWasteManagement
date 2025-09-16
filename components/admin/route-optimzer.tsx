"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RouteOptimizer,
  mockNodes,
  mockEdges,
  type OptimizedRoute,
} from "@/lib/dijkstra";
import {
  Zap,
  Clock,
  Fuel,
  TrendingUp,
  Route,
  Navigation,
  CheckCircle,
} from "lucide-react";

interface RouteOptimizerProps {
  collectionPoints: string[];
  onOptimizationComplete?: (result: OptimizedRoute) => void;
}

export function RouteOptimizerComponent({
  collectionPoints,
  onOptimizationComplete,
}: RouteOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] =
    useState<OptimizedRoute | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);

    // Simulate optimization delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const optimizer = new RouteOptimizer(mockNodes, mockEdges);
      const result = optimizer.optimizeRoute("depot", collectionPoints);

      setOptimizationResult(result);
      onOptimizationComplete?.(result);
    } catch (error) {
      console.error("Optimization failed:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getNodeName = (nodeId: string): string => {
    const node = mockNodes.find((n) => n.id === nodeId);
    return node?.name || nodeId;
  };

  const getNodeType = (nodeId: string): string => {
    const node = mockNodes.find((n) => n.id === nodeId);
    return node?.type || "unknown";
  };

  return (
    <div className="space-y-6">
      {/* Optimization Control */}
      <Card className="border-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Route Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Dijkstra's Algorithm</div>
                <div className="text-sm text-muted-foreground">
                  Optimizes routes considering distance, time, traffic, and
                  priority
                </div>
              </div>
              <Button
                onClick={handleOptimize}
                disabled={isOptimizing || collectionPoints.length === 0}
                className="min-w-32"
              >
                {isOptimizing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Optimize Route
                  </>
                )}
              </Button>
            </div>

            {collectionPoints.length === 0 && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                Add collection points to enable route optimization
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimizationResult && (
        <Card className="border-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Optimization Complete
              </CardTitle>
              <Badge variant="secondary">
                {optimizationResult.efficiency}% Improvement
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Route className="h-4 w-4" />
                  Total Distance
                </div>
                <div className="text-2xl font-bold">
                  {optimizationResult.totalDistance} km
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Total Time
                </div>
                <div className="text-2xl font-bold">
                  {Math.floor(optimizationResult.totalTime / 60)}h{" "}
                  {optimizationResult.totalTime % 60}m
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Fuel className="h-4 w-4" />
                  Fuel Saved
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {optimizationResult.savings.fuelSaved}L
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Efficiency
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {optimizationResult.efficiency}%
                </div>
              </div>
            </div>

            {/* Savings Breakdown */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="font-medium text-green-800 mb-3">
                Optimization Savings
              </div>
              <div className="grid gap-3 md:grid-cols-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Distance Saved:</span>
                  <span className="font-medium text-green-800">
                    {optimizationResult.savings.distanceSaved} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Time Saved:</span>
                  <span className="font-medium text-green-800">
                    {optimizationResult.savings.timeSaved} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Fuel Saved:</span>
                  <span className="font-medium text-green-800">
                    {optimizationResult.savings.fuelSaved}L
                  </span>
                </div>
              </div>
            </div>

            {/* Route Details Toggle */}
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full bg-transparent"
              >
                {showDetails ? "Hide" : "Show"} Optimized Route Details
              </Button>

              {showDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Optimized Route Path
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {optimizationResult.path.map((nodeId, index) => (
                        <div
                          key={`${nodeId}-${index}`}
                          className="flex items-center gap-4"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {getNodeName(nodeId)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getNodeType(nodeId) === "depot"
                                ? "Depot"
                                : "Collection Point"}
                            </div>
                          </div>
                          {index < optimizationResult.path.length - 1 && (
                            <Navigation className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
