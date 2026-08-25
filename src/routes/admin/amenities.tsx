import { createFileRoute } from "@tanstack/react-router";
import { FacilityPage } from "@/components/admin/facility-page";

export const Route = createFileRoute("/admin/amenities")({
  component: () => (
    <FacilityPage
      kind="amenities"
      title="Amenities"
      hint="Whatever you add here appears on your public gym page and in the member app. Photograph it when you can."
    />
  ),
});
