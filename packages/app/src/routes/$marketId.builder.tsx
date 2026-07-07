import { createFileRoute } from "@tanstack/react-router";
import Builder from "@/pages/builder.tsx";
import { requireAuth } from "@/routes/-require-auth.ts";

export const Route = createFileRoute("/$marketId/builder")({
	beforeLoad: requireAuth,
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => ({
		automationId:
			typeof search.automationId === "string" ? search.automationId : undefined,
	}),
});

function RouteComponent() {
	const { marketId } = Route.useParams();
	const { automationId } = Route.useSearch();

	return <Builder automationId={automationId} marketId={marketId} />;
}
