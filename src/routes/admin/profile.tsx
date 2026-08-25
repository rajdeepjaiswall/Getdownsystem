import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { updateGym } from "@/lib/server/admin";
import { useSessionContext } from "@/components/role-gate";
import { fileToDataUrl } from "@/lib/file-to-data-url";

export const Route = createFileRoute("/admin/profile")({ component: Profile });

function Profile() {
  const { ctx } = useSessionContext();
  const qc = useQueryClient();
  const gym = ctx?.gym;
  const mut = useMutation({
    mutationFn: updateGym,
    onSuccess: () => {
      toast.success("Saved");
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
  if (!gym) return null;
  return (
    <div>
      <PageHeader
        title="Gym profile"
        hint="This is what the public page and the member app read."
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/g/$slug" params={{ slug: gym.slug }}>
              View page
            </Link>
          </Button>
        }
      />
      <form
        className="grid max-w-xl gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const logo = fd.get("logo") as File | null;
          const cover = fd.get("cover") as File | null;
          mut.mutate({
            data: {
              name: String(fd.get("name") || ""),
              city: String(fd.get("city") || ""),
              address: String(fd.get("address") || ""),
              phone: String(fd.get("phone") || ""),
              about_text: String(fd.get("about_text") || ""),
              brand_color: String(fd.get("brand_color") || "#5B8C51"),
              logo_url: logo && logo.size ? await fileToDataUrl(logo) : undefined,
              cover_image_url: cover && cover.size ? await fileToDataUrl(cover) : undefined,
            },
          });
        }}
      >
        <Field label="Name">
          <Input name="name" defaultValue={gym.name} />
        </Field>
        <Field label="City">
          <Input name="city" defaultValue={gym.city ?? ""} />
        </Field>
        <Field label="Address">
          <Input name="address" defaultValue={gym.address ?? ""} />
        </Field>
        <Field label="Phone">
          <Input name="phone" defaultValue={gym.phone ?? ""} />
        </Field>
        <Field label="About">
          <Textarea name="about_text" defaultValue={gym.about_text ?? ""} />
        </Field>
        <Field label="Brand colour">
          <Input name="brand_color" type="color" defaultValue={gym.brand_color} className="h-11 w-20 p-1" />
        </Field>
        <Field label="Logo">
          <Input name="logo" type="file" accept="image/*" />
        </Field>
        <Field label="Cover photo">
          <Input name="cover" type="file" accept="image/*" />
        </Field>
        <Button type="submit" disabled={mut.isPending}>
          Save
        </Button>
      </form>
    </div>
  );
}
