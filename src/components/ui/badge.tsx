import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: ComponentProps<"span"> & {
  tone?: "default" | "primary" | "clay" | "warn" | "danger" | "muted";
}) {
  const tones = {
    default: "bg-primary-tint text-primary",
    primary: "bg-primary text-white",
    clay: "bg-accent-clay/15 text-accent-clay",
    warn: "bg-warn-tint text-warn",
    danger: "bg-danger-tint text-danger",
    muted: "bg-border/80 text-text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
