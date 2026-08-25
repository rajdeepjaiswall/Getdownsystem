import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { listRedList } from "@/lib/server/admin";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/admin/red-list")({ component: RedList });

function RedList() {
  const q = useQuery({ queryKey: ["red-list"], queryFn: () => listRedList() });
  return (
    <div>
      <PageHeader
        title="Red list"
        hint="Active members with no attendance in 15 days. Call them before they quietly expire."
      />
      <div className="grid gap-3">
        {(q.data ?? []).map((m) => (
          <Card key={String(m.id)} className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{String(m.full_name)}</p>
              <p className="text-sm text-text-muted">{String(m.phone ?? "—")}</p>
            </div>
            <p className="text-sm text-accent-clay">
              Last in {m.last_checkin ? formatDate(String(m.last_checkin)) : "never"}
            </p>
          </Card>
        ))}
        {q.data?.length === 0 ? <p className="text-sm text-text-muted">Everyone has shown up. Good.</p> : null}
      </div>
    </div>
  );
}
