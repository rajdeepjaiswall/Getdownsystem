import type { ReactNode } from "react";
import { Wordmark } from "./brand";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
        <Wordmark />
        <h1 className="mt-10 font-display text-3xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-text-muted">{subtitle}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
