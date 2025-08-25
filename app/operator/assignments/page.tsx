import { OperatorAssignments } from "@/components/operator-assignments";
import { RouteGuard } from "@/components/route-guard";

export default function OperatorAssignmentsPage() {
  return (
    <RouteGuard requiredRole="operator">
      <OperatorAssignments />
    </RouteGuard>
  );
}
