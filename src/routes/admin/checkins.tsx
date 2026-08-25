import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { listCheckins } from "@/lib/server/admin";
import { useSessionContext } from "@/components/role-gate";

export const Route = createFileRoute("/admin/checkins")({ component: Checkins });

function Checkins() {
  const q = useQuery({ queryKey: ["checkins"], queryFn: () => listCheckins() });
  const { ctx } = useSessionContext();
  const url =
    typeof window !== "undefined" && ctx?.gym
      ? `${window.location.origin}/g/${ctx.gym.slug}`
      : "";
  return (
    <div>
      <PageHeader title="Check-ins" hint="Gate scans and trainer marks. Put the QR on the door." />
      {url ? (
        <Card className="mb-4 flex items-center gap-4 p-4">
          <img
            alt="Gate QR"
            className="h-28 w-28"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`}
          />
          <p className="text-sm text-text-muted">
            Members open the app and tap Check in. This QR can also sit on the public page.
          </p>
        </Card>
      ) : null}
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {(q.data ?? []).map((c) => (
              <tr key={String(c.id)} className="border-t border-border">
                <td className="px-4 py-3">{String(c.full_name)}</td>
                <td className="px-4 py-3 tabular-nums text-text-muted">
                  {new Date(String(c.checked_in_at)).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-text-muted">{String(c.source)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
