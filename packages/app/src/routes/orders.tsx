import { createFileRoute } from "@tanstack/react-router";
import Orders from "@/pages/orders.tsx";
import { requireAuth } from "@/routes/-require-auth.ts";

export const Route = createFileRoute("/orders")({
	beforeLoad: requireAuth,
	component: Orders,
});
