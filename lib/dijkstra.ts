// Dijkstra's Algorithm implementation for route optimization

export interface Node {
  id: string
  name: string
  coordinates: { lat: number; lng: number }
  type: "depot" | "collection_point"
  priority: number
  estimatedServiceTime: number // in minutes
}

export interface Edge {
  from: string
  to: string
  distance: number // in kilometers
  travelTime: number // in minutes
  trafficFactor: number // 1.0 = normal, 1.5 = heavy traffic
}

export interface OptimizedRoute {
  path: string[]
  totalDistance: number
  totalTime: number
  efficiency: number
  savings: {
    distanceSaved: number
    timeSaved: number
    fuelSaved: number
  }
}

export class RouteOptimizer {
  private nodes: Map<string, Node> = new Map()
  private edges: Map<string, Edge[]> = new Map()

  constructor(nodes: Node[], edges: Edge[]) {
    // Initialize nodes
    nodes.forEach((node) => {
      this.nodes.set(node.id, node)
      this.edges.set(node.id, [])
    })

    // Initialize edges (bidirectional)
    edges.forEach((edge) => {
      this.edges.get(edge.from)?.push(edge)
      // Add reverse edge
      this.edges.get(edge.to)?.push({
        from: edge.to,
        to: edge.from,
        distance: edge.distance,
        travelTime: edge.travelTime,
        trafficFactor: edge.trafficFactor,
      })
    })
  }

  /**
   * Dijkstra's algorithm implementation
   */
  private dijkstra(startId: string, endId?: string): Map<string, { distance: number; previous: string | null }> {
    const distances = new Map<string, number>()
    const previous = new Map<string, string | null>()
    const unvisited = new Set<string>()

    // Initialize distances
    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, nodeId === startId ? 0 : Number.POSITIVE_INFINITY)
      previous.set(nodeId, null)
      unvisited.add(nodeId)
    }

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let currentNode: string | null = null
      let minDistance = Number.POSITIVE_INFINITY

      for (const nodeId of unvisited) {
        const distance = distances.get(nodeId) || Number.POSITIVE_INFINITY
        if (distance < minDistance) {
          minDistance = distance
          currentNode = nodeId
        }
      }

      if (!currentNode || minDistance === Number.POSITIVE_INFINITY) break

      // If we're looking for a specific end node and found it, we can stop
      if (endId && currentNode === endId) break

      unvisited.delete(currentNode)

      // Check neighbors
      const neighbors = this.edges.get(currentNode) || []
      for (const edge of neighbors) {
        if (!unvisited.has(edge.to)) continue

        const currentDistance = distances.get(currentNode) || 0
        const edgeWeight = edge.travelTime * edge.trafficFactor // Use time as weight
        const newDistance = currentDistance + edgeWeight

        if (newDistance < (distances.get(edge.to) || Number.POSITIVE_INFINITY)) {
          distances.set(edge.to, newDistance)
          previous.set(edge.to, currentNode)
        }
      }
    }

    const result = new Map<string, { distance: number; previous: string | null }>()
    for (const nodeId of this.nodes.keys()) {
      result.set(nodeId, {
        distance: distances.get(nodeId) || Number.POSITIVE_INFINITY,
        previous: previous.get(nodeId) || null,
      })
    }

    return result
  }

  /**
   * Get shortest path between two nodes
   */
  getShortestPath(startId: string, endId: string): string[] {
    const result = this.dijkstra(startId, endId)
    const path: string[] = []
    let current: string | null = endId

    while (current !== null) {
      path.unshift(current)
      current = result.get(current)?.previous || null
    }

    return path.length > 1 ? path : []
  }

  /**
   * Optimize route for multiple collection points using nearest neighbor heuristic
   * combined with Dijkstra's algorithm
   */
  optimizeRoute(depotId: string, collectionPointIds: string[]): OptimizedRoute {
    if (collectionPointIds.length === 0) {
      return {
        path: [depotId],
        totalDistance: 0,
        totalTime: 0,
        efficiency: 100,
        savings: { distanceSaved: 0, timeSaved: 0, fuelSaved: 0 },
      }
    }

    // Sort collection points by priority (higher priority first)
    const sortedPoints = [...collectionPointIds].sort((a, b) => {
      const nodeA = this.nodes.get(a)
      const nodeB = this.nodes.get(b)
      return (nodeB?.priority || 0) - (nodeA?.priority || 0)
    })

    // Start from depot
    const optimizedPath: string[] = [depotId]
    const unvisited = new Set(sortedPoints)
    let currentNode = depotId
    let totalDistance = 0
    let totalTime = 0

    // Nearest neighbor algorithm with priority consideration
    while (unvisited.size > 0) {
      let nearestNode: string | null = null
      let shortestDistance = Number.POSITIVE_INFINITY
      let shortestTime = Number.POSITIVE_INFINITY

      // Find nearest unvisited high-priority node
      const highPriorityNodes = Array.from(unvisited).filter((nodeId) => {
        const node = this.nodes.get(nodeId)
        return node && node.priority >= 3 // High priority threshold
      })

      const candidateNodes = highPriorityNodes.length > 0 ? highPriorityNodes : Array.from(unvisited)

      for (const nodeId of candidateNodes) {
        const path = this.getShortestPath(currentNode, nodeId)
        if (path.length > 1) {
          const pathDistance = this.calculatePathDistance(path)
          const pathTime = this.calculatePathTime(path)

          // Prioritize by time, but consider priority
          const node = this.nodes.get(nodeId)
          const priorityBonus = node ? node.priority * 0.1 : 0
          const adjustedTime = pathTime - pathTime * priorityBonus

          if (adjustedTime < shortestTime) {
            shortestTime = pathTime
            shortestDistance = pathDistance
            nearestNode = nodeId
          }
        }
      }

      if (nearestNode) {
        const pathToNearest = this.getShortestPath(currentNode, nearestNode)
        // Add intermediate nodes (excluding current node)
        optimizedPath.push(...pathToNearest.slice(1))

        totalDistance += shortestDistance
        totalTime += shortestTime

        // Add service time
        const node = this.nodes.get(nearestNode)
        if (node) {
          totalTime += node.estimatedServiceTime
        }

        currentNode = nearestNode
        unvisited.delete(nearestNode)
      } else {
        break // No path found
      }
    }

    // Return to depot
    const returnPath = this.getShortestPath(currentNode, depotId)
    if (returnPath.length > 1) {
      optimizedPath.push(...returnPath.slice(1))
      totalDistance += this.calculatePathDistance(returnPath)
      totalTime += this.calculatePathTime(returnPath)
    }

    // Calculate efficiency and savings compared to naive route
    const naiveDistance = this.calculateNaiveRouteDistance(depotId, collectionPointIds)
    const naiveTime = this.calculateNaiveRouteTime(depotId, collectionPointIds)

    const distanceSaved = Math.max(0, naiveDistance - totalDistance)
    const timeSaved = Math.max(0, naiveTime - totalTime)
    const fuelSaved = distanceSaved * 0.1 // Assume 0.1L per km saved
    const efficiency = naiveDistance > 0 ? Math.round((distanceSaved / naiveDistance) * 100) : 0

    return {
      path: optimizedPath,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalTime: Math.round(totalTime),
      efficiency: Math.max(efficiency, 0),
      savings: {
        distanceSaved: Math.round(distanceSaved * 100) / 100,
        timeSaved: Math.round(timeSaved),
        fuelSaved: Math.round(fuelSaved * 100) / 100,
      },
    }
  }

  private calculatePathDistance(path: string[]): number {
    let distance = 0
    for (let i = 0; i < path.length - 1; i++) {
      const edges = this.edges.get(path[i]) || []
      const edge = edges.find((e) => e.to === path[i + 1])
      if (edge) {
        distance += edge.distance
      }
    }
    return distance
  }

  private calculatePathTime(path: string[]): number {
    let time = 0
    for (let i = 0; i < path.length - 1; i++) {
      const edges = this.edges.get(path[i]) || []
      const edge = edges.find((e) => e.to === path[i + 1])
      if (edge) {
        time += edge.travelTime * edge.trafficFactor
      }
    }
    return time
  }

  private calculateNaiveRouteDistance(depotId: string, collectionPointIds: string[]): number {
    let distance = 0
    let current = depotId

    // Visit points in order
    for (const pointId of collectionPointIds) {
      const path = this.getShortestPath(current, pointId)
      distance += this.calculatePathDistance(path)
      current = pointId
    }

    // Return to depot
    const returnPath = this.getShortestPath(current, depotId)
    distance += this.calculatePathDistance(returnPath)

    return distance
  }

  private calculateNaiveRouteTime(depotId: string, collectionPointIds: string[]): number {
    let time = 0
    let current = depotId

    // Visit points in order
    for (const pointId of collectionPointIds) {
      const path = this.getShortestPath(current, pointId)
      time += this.calculatePathTime(path)

      // Add service time
      const node = this.nodes.get(pointId)
      if (node) {
        time += node.estimatedServiceTime
      }

      current = pointId
    }

    // Return to depot
    const returnPath = this.getShortestPath(current, depotId)
    time += this.calculatePathTime(returnPath)

    return time
  }
}

// Mock data for demonstration
export const mockNodes: Node[] = [
  {
    id: "depot",
    name: "Central Depot",
    coordinates: { lat: 40.7128, lng: -74.006 },
    type: "depot",
    priority: 0,
    estimatedServiceTime: 0,
  },
  {
    id: "cp1",
    name: "Main St & 1st Ave",
    coordinates: { lat: 40.714, lng: -74.005 },
    type: "collection_point",
    priority: 5,
    estimatedServiceTime: 10,
  },
  {
    id: "cp2",
    name: "Oak Ave & 2nd St",
    coordinates: { lat: 40.715, lng: -74.004 },
    type: "collection_point",
    priority: 3,
    estimatedServiceTime: 8,
  },
  {
    id: "cp3",
    name: "Pine St & 3rd Ave",
    coordinates: { lat: 40.716, lng: -74.003 },
    type: "collection_point",
    priority: 4,
    estimatedServiceTime: 12,
  },
  {
    id: "cp4",
    name: "Elm Dr & 4th St",
    coordinates: { lat: 40.712, lng: -74.007 },
    type: "collection_point",
    priority: 2,
    estimatedServiceTime: 6,
  },
  {
    id: "cp5",
    name: "Maple Ln & 5th Ave",
    coordinates: { lat: 40.711, lng: -74.008 },
    type: "collection_point",
    priority: 5,
    estimatedServiceTime: 15,
  },
  {
    id: "cp6",
    name: "Cedar St & 6th St",
    coordinates: { lat: 40.717, lng: -74.002 },
    type: "collection_point",
    priority: 3,
    estimatedServiceTime: 10,
  },
]

export const mockEdges: Edge[] = [
  { from: "depot", to: "cp1", distance: 1.2, travelTime: 8, trafficFactor: 1.0 },
  { from: "depot", to: "cp4", distance: 1.5, travelTime: 10, trafficFactor: 1.2 },
  { from: "cp1", to: "cp2", distance: 0.8, travelTime: 5, trafficFactor: 1.1 },
  { from: "cp1", to: "cp3", distance: 1.0, travelTime: 7, trafficFactor: 1.0 },
  { from: "cp2", to: "cp3", distance: 0.6, travelTime: 4, trafficFactor: 1.0 },
  { from: "cp2", to: "cp6", distance: 1.1, travelTime: 8, trafficFactor: 1.1 },
  { from: "cp3", to: "cp6", distance: 0.9, travelTime: 6, trafficFactor: 1.0 },
  { from: "cp4", to: "cp5", distance: 0.7, travelTime: 5, trafficFactor: 1.0 },
  { from: "cp4", to: "cp1", distance: 1.3, travelTime: 9, trafficFactor: 1.2 },
  { from: "cp5", to: "depot", distance: 1.8, travelTime: 12, trafficFactor: 1.1 },
  { from: "cp5", to: "cp4", distance: 0.7, travelTime: 5, trafficFactor: 1.0 },
  { from: "cp6", to: "depot", distance: 2.1, travelTime: 15, trafficFactor: 1.3 },
]
