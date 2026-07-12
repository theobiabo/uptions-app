import { createFileRoute } from "@tanstack/react-router";
import Settings from "@/pages/settings.tsx";
import { requireAuth } from "@/routes/-require-auth.ts";

export const Route = createFileRoute("/settings")({
	beforeLoad: requireAuth,
	component: Settings,
});
