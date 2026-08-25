import { createFileRoute } from "@tanstack/react-router";
import { MarketingHome } from "@/components/marketing/home";

export const Route = createFileRoute("/")({ component: MarketingHome });
