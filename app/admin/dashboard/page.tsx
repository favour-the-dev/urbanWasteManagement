import { AdminDashboard } from "@/components/admin-dashboard";
import { RouteGuard } from "@/components/route-guard";
export default function AdminDashboardPage() {
  return (
    <RouteGuard requiredRole="admin">
      <AdminDashboard />
    </RouteGuard>
  );
}
