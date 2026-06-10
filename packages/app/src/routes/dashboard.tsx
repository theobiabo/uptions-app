import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/dashboard.tsx";
import { requireAuth } from "@/routes/-require-auth.ts";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: requireAuth,
	component: Dashboard,
});
