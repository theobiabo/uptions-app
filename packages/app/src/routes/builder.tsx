import { createFileRoute } from "@tanstack/react-router";
import Builder from "@/pages/builder.tsx";
import { requireAuth } from "@/routes/-require-auth.ts";

export const Route = createFileRoute("/builder")({
	beforeLoad: requireAuth,
	component: Builder,
});
