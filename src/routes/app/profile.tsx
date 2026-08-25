import { createFileRoute, Link } from "@tanstack/react-router";
import { signOut } from "@/lib/auth/client";
import { useSessionContext } from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export const Route = createFileRoute("/app/profile")({ component: Profile });

function Profile() {
  const { ctx } = useSessionContext();
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Profile</h1>
      <p className="text-sm">{ctx?.name ?? ctx?.email}</p>
      <p className="text-sm text-text-muted">{ctx?.gym?.name}</p>
      {ctx?.isOwner ? (
        <Button asChild variant="outline">
          <Link to="/admin">Back to desk</Link>
        </Button>
      ) : null}
      <Button variant="ghost" onClick={() => void signOut("/")}>
        Sign out
      </Button>
      {ctx?.gym?.show_powered_by ? (
        <p className="pt-8 text-center text-xs text-text-muted">Powered by {APP_NAME}</p>
      ) : null}
    </div>
  );
}
