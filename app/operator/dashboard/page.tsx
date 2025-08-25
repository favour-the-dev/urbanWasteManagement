import OperatorDashboard from "@/components/operator-dashboard";
import { RouteGuard } from "@/components/route-guard";
export default function OperatorDashboardPage() {
  return (
    <RouteGuard requiredRole="operator">
      <OperatorDashboard />
    </RouteGuard>
  );
}
