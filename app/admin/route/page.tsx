import { RouteManagement } from "@/components/route-management";
import { RouteGuard } from "@/components/route-guard";
export default function AdminRoutesPage() {
  return (
    <RouteGuard requiredRole="admin">
      <RouteManagement />
    </RouteGuard>
  );
}
