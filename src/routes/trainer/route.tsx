import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { RoleGate, useSessionContext } from "@/components/role-gate";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trainer")({ component: Shell });

function Shell() {
  return (
    <RoleGate allow={["trainer", "gym_owner", "super_admin"]}>
      <Frame />
    </RoleGate>
  );
}

function Frame() {
  const { ctx } = useSessionContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const color = ctx?.gym?.brand_color || "#5B8C51";
  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {ctx?.gym?.logo_url ? (
              <img src={ctx.gym.logo_url} alt="" className="h-8 w-8 rounded-md object-cover" />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-md text-white text-xs" style={{ background: color }}>
                {ctx?.gym?.name?.[0]}
              </span>
            )}
            <span className="text-sm font-semibold">Trainer · {ctx?.gym?.name}</span>
          </div>
          <UserButton />
        </div>
        <nav className="mx-auto flex max-w-3xl gap-1 px-2 pb-2">
          {[
            { to: "/trainer", label: "Clients" },
          ].map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm",
                path === t.to ? "bg-primary-tint text-primary font-medium" : "text-text-muted",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
