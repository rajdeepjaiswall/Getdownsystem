import { createFileRoute } from "@tanstack/react-router";
import { FacilityPage } from "@/components/admin/facility-page";

export const Route = createFileRoute("/admin/equipment")({
  component: () => (
    <FacilityPage
      kind="equipment"
      title="Equipment"
      hint="The list members see when they ask ‘do you have a squat rack?’ Fill it once; it lives on your public page."
    />
  ),
});
