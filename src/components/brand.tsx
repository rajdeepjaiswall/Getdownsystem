import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/getdown-logo.jpg"
      alt="Getdown Foundation"
      className={cn("h-10 w-auto object-contain object-left", className)}
    />
  );
}

export function Wordmark({
  className,
  to = "/",
}: {
  className?: string;
  to?: string;
}) {
  return (
    <Link to={to} className={cn("flex items-center gap-2.5 min-w-0", className)}>
      <img
        src="/getdown-logo.jpg"
        alt=""
        className="h-9 w-9 rounded-md object-cover shrink-0"
      />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="font-display text-lg font-semibold tracking-tight text-text">
          Getdown Fitness
        </span>
        <span className="label-caps">Get Down Foundation</span>
      </span>
    </Link>
  );
}
