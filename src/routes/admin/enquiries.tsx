import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listEnquiries, setEnquiryStatus } from "@/lib/server/admin";

export const Route = createFileRoute("/admin/enquiries")({ component: Enquiries });

function Enquiries() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["enquiries"], queryFn: () => listEnquiries() });
  const mut = useMutation({
    mutationFn: setEnquiryStatus,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["enquiries"] }),
  });
  return (
    <div>
      <PageHeader title="Enquiries" hint="From your public gym page." />
      <div className="grid gap-3">
        {(q.data ?? []).map((e) => (
          <Card key={String(e.id)} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{String(e.name)}</p>
                <p className="text-sm text-text-muted">{String(e.phone ?? "")}</p>
                <p className="mt-2 text-sm">{String(e.message ?? "")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={e.status === "new" ? "warn" : "muted"}>{String(e.status)}</Badge>
                {e.status === "new" ? (
                  <Button size="sm" variant="outline" onClick={() => mut.mutate({ data: { id: String(e.id), status: "closed" } })}>
                    Close
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
        {q.data?.length === 0 ? <p className="text-sm text-text-muted">No enquiries yet.</p> : null}
      </div>
    </div>
  );
}
