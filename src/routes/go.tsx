import { createFileRoute, Navigate } from "@tanstack/react-router";
import { RoleGate, useSessionContext } from "@/components/role-gate";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/go")({ component: Go });

function Go() {
  return (
    <RoleGate allow="any">
      <Redirector />
    </RoleGate>
  );
}

function Redirector() {
  const { ctx, isPending } = useSessionContext();
  if (isPending || !ctx) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg">
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }
  if (ctx.isSuperAdmin && !ctx.gymId) return <Navigate to="/god" />;
  if (ctx.isOwner || ctx.isStaff) {
    if (ctx.gym && !ctx.gym.onboarding_completed && ctx.isOwner) return <Navigate to="/setup" />;
    return <Navigate to="/admin" />;
  }
  if (ctx.isTrainer) return <Navigate to="/trainer" />;
  if (ctx.isMember) return <Navigate to="/app" />;
  if (ctx.isSuperAdmin) return <Navigate to="/god" />;
  return <Navigate to="/signup" />;
}
