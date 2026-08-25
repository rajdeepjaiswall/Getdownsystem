import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyContext } from "@/lib/server/session";
import type { Role } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

export function useSessionContext() {
  const auth = useCurrentUserState();
  const q = useQuery({
    queryKey: ["me"],
    queryFn: () => getMyContext(),
    enabled: Boolean(auth.user) && !auth.isPending,
  });
  return { auth, ctx: q.data, isPending: auth.isPending || (Boolean(auth.user) && q.isPending) };
}

export function RoleGate({
  allow,
  children,
}: {
  allow: Role[] | "any";
  children: ReactNode;
}) {
  const { auth, ctx, isPending } = useSessionContext();
  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg">
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }
  if (!auth.user) return <RedirectToSignIn />;
  if (!ctx) return <RedirectToSignIn />;
  if (allow !== "any") {
    const ok = allow.some((r) => {
      if (r === "super_admin") return ctx.isSuperAdmin;
      if (r === "gym_owner") return ctx.isOwner || ctx.isSuperAdmin;
      if (r === "staff") return ctx.isStaff || ctx.isOwner || ctx.isSuperAdmin;
      if (r === "trainer") return ctx.isTrainer || ctx.isOwner || ctx.isSuperAdmin;
      if (r === "member") return ctx.isMember || ctx.isOwner || ctx.isSuperAdmin;
      return ctx.roles.includes(r);
    });
    if (!ok) return <Navigate to="/go" />;
  }
  return <>{children}</>;
}
