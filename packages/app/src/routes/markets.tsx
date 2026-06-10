import { createFileRoute } from "@tanstack/react-router";
import Markets from "@/pages/markets.tsx";
import { requireAuth } from "@/routes/-require-auth.ts";

export const Route = createFileRoute("/markets")({
	beforeLoad: requireAuth,
	component: Markets,
});
