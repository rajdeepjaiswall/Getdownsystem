import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Building2,
  CalendarClock,
  ClipboardList,
  Dumbbell,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  QrCode,
  Settings,
  Shield,
  Sparkles,
  Users,
  UserPlus,
  Warehouse,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { signOut } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { RoleGate, useSessionContext } from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SessionContext } from "@/lib/types";

type NavItem = { to: string; label: string; icon: typeof Users; badge?: number };

export function AdminShell() {
  return (
    <RoleGate allow={["gym_owner", "staff", "super_admin"]}>
      <AdminFrame />
    </RoleGate>
  );
}

function AdminFrame() {
  const { ctx } = useSessionContext();
  const [open, setOpen] = useState(false);
  if (!ctx?.gym && !ctx?.isSuperAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-4 text-center">
        <div>
          <h1 className="font-display text-2xl">No gym on this account</h1>
          <Button asChild className="mt-4">
            <Link to="/signup">Create one</Link>
          </Button>
        </div>
      </div>
    );
  }
  const staffOnly = ctx && !ctx.isOwner && !ctx.isSuperAdmin && ctx.roles.includes("staff");
  return (
    <div className="flex min-h-dvh bg-bg">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
        <Sidebar ctx={ctx!} staffOnly={Boolean(staffOnly)} />
      </aside>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-text/30" onClick={() => setOpen(false)} aria-label="Close menu" />
          <aside className="relative z-50 flex h-full w-60 flex-col bg-surface">
            <div className="flex justify-end p-2">
              <button className="rounded-md p-2" onClick={() => setOpen(false)}>
                <X className="size-4" />
              </button>
            </div>
            <Sidebar ctx={ctx!} staffOnly={Boolean(staffOnly)} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-surface px-4">
          <button className="rounded-md p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{ctx?.gym?.name ?? "Admin"}</p>
            {ctx?.impersonating ? (
              <p className="text-xs text-accent-clay">Impersonating · actions are logged</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {ctx?.isSuperAdmin ? (
              <Link to="/god" className="hidden text-xs text-text-muted hover:text-text sm:inline">
                Super admin
              </Link>
            ) : null}
            <UserButton />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar({
  ctx,
  staffOnly,
  onNavigate,
}: {
  ctx: SessionContext;
  staffOnly: boolean;
  onNavigate?: () => void;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const ops: NavItem[] = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/members", label: "Members", icon: Users },
    { to: "/admin/signups", label: "Signups", icon: UserPlus },
    { to: "/admin/renewals", label: "Renewals due", icon: CalendarClock },
    { to: "/admin/checkins", label: "Check-ins", icon: QrCode },
    { to: "/admin/enquiries", label: "Enquiries", icon: ClipboardList },
    { to: "/admin/red-list", label: "Red list", icon: AlertTriangle },
  ];
  const content: NavItem[] = [
    { to: "/admin/plans", label: "Plans", icon: BadgeCheck },
    { to: "/admin/trainers", label: "Trainers", icon: Sparkles },
    { to: "/admin/amenities", label: "Amenities", icon: Warehouse },
    { to: "/admin/equipment", label: "Equipment", icon: Dumbbell },
    { to: "/admin/testimonials", label: "Testimonials", icon: Building2 },
    { to: "/admin/transformations", label: "Transformations", icon: ImageIcon },
    { to: "/admin/profile", label: "Gym profile", icon: Activity },
  ];
  const settings: NavItem[] = [{ to: "/admin/settings", label: "Settings", icon: Settings }];
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        {ctx.gym?.logo_url ? (
          <img src={ctx.gym.logo_url} alt="" className="h-8 w-8 rounded-md object-cover" />
        ) : (
          <span
            className="grid h-8 w-8 place-items-center rounded-md text-xs font-semibold text-white"
            style={{ background: ctx.gym?.brand_color ?? "#5B8C51" }}
          >
            {ctx.gym?.name?.[0] ?? "G"}
          </span>
        )}
        <span className="truncate text-sm font-semibold">{ctx.gym?.name}</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <p className="label-caps px-2 py-2">Operations</p>
        {ops.map((i) => (
          <NavLink key={i.to} item={i} active={path === i.to} onClick={onNavigate} />
        ))}
        {!staffOnly ? (
          <>
            <p className="label-caps mt-4 px-2 py-2">Content</p>
            {content.map((i) => (
              <NavLink key={i.to} item={i} active={path === i.to} onClick={onNavigate} />
            ))}
            <p className="label-caps mt-4 px-2 py-2">Settings</p>
            {settings.map((i) => (
              <NavLink key={i.to} item={i} active={path === i.to} onClick={onNavigate} />
            ))}
          </>
        ) : null}
        {ctx.isSuperAdmin ? (
          <NavLink
            item={{ to: "/god", label: "Super admin", icon: Shield }}
            active={path.startsWith("/god")}
            onClick={onNavigate}
          />
        ) : null}
      </nav>
      <button
        type="button"
        className="flex items-center gap-2 border-t border-border px-4 py-3 text-sm text-text-muted hover:text-text"
        onClick={() => void signOut("/")}
      >
        <LogOut className="size-4" /> Sign out
      </button>
    </div>
  );
}

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-2 text-sm",
        active ? "bg-primary-tint text-primary font-medium" : "text-text-muted hover:bg-primary-tint/50 hover:text-text",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge ? <Badge>{item.badge}</Badge> : null}
    </Link>
  );
}

export function PageHeader({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl">{title}</h1>
        {hint ? <p className="mt-1 text-sm text-text-muted">{hint}</p> : null}
      </div>
      {action}
    </div>
  );
}
