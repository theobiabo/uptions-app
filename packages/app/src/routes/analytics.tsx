import { createFileRoute } from "@tanstack/react-router";
import Analytics from "@/pages/analytics.tsx";
import { requireAuth } from "@/routes/-require-auth.ts";

export const Route = createFileRoute("/analytics")({
	beforeLoad: requireAuth,
	component: Analytics,
});
