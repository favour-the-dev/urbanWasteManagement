import { AssignmentManagement } from "@/components/assignment-management";
import { RouteGuard } from "@/components/route-guard";
export default function AdminAssignmentsPage() {
  return (
    <RouteGuard requiredRole="admin">
      <AssignmentManagement />
    </RouteGuard>
  );
}
