import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Dumbbell, Home, QrCode, UserRound, LineChart } from "lucide-react";
import { RoleGate, useSessionContext } from "@/components/role-gate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({ component: MemberShell });

function MemberShell() {
  return (
    <RoleGate allow={["member", "gym_owner", "super_admin"]}>
      <Frame />
    </RoleGate>
  );
}

function Frame() {
  const { ctx } = useSessionContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const color = ctx?.gym?.brand_color || "#5B8C51";
  const tabs = [
    { to: "/app", label: "Home", icon: Home },
    { to: "/app/checkin", label: "Check in", icon: QrCode },
    { to: "/app/plan", label: "My plan", icon: Dumbbell },
    { to: "/app/progress", label: "Progress", icon: LineChart },
    { to: "/app/profile", label: "Profile", icon: UserRound },
  ];
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-bg">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        {ctx?.gym?.logo_url ? (
          <img src={ctx.gym.logo_url} alt="" className="h-8 w-8 rounded-md object-cover" />
        ) : (
          <span className="grid h-8 w-8 place-items-center rounded-md text-xs text-white" style={{ background: color }}>
            {ctx?.gym?.name?.[0]}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{ctx?.gym?.name}</p>
          {ctx && !ctx.isMember ? <p className="text-xs text-accent-clay">Owner preview</p> : null}
        </div>
      </header>
      <main className="flex-1 px-4 py-5 pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 mx-auto flex max-w-md border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
        {tabs.map((t) => {
          const active = path === t.to;
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex h-16 flex-1 flex-col items-center justify-center gap-1 text-xs",
                active ? "font-medium" : "text-text-muted",
              )}
              style={active ? { color } : undefined}
            >
              <Icon className="size-5" />
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
