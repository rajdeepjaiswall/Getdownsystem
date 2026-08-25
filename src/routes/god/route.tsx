import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";
import { Wordmark } from "@/components/brand";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/god")({ component: GodShell });

function GodShell() {
  return (
    <RoleGate allow={["super_admin"]}>
      <Frame />
    </RoleGate>
  );
}

function Frame() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/god", label: "Overview" },
    { to: "/god/gyms", label: "Gyms" },
    { to: "/god/payments", label: "Payments" },
    { to: "/god/leads", label: "Leads" },
    { to: "/god/settings", label: "Settings" },
  ];
  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Wordmark to="/god" />
            <span className="label-caps hidden sm:inline">God panel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-sm text-text-muted">
              Desk
            </Link>
            <UserButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pb-2">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 text-sm",
                path === i.to ? "bg-primary-tint text-primary font-medium" : "text-text-muted hover:text-text",
              )}
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
