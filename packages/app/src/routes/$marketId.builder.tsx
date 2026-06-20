import { createFileRoute } from "@tanstack/react-router";
import Builder from "@/pages/builder.tsx";
import { requireAuth } from "@/routes/-require-auth.ts";

export const Route = createFileRoute("/$marketId/builder")({
	beforeLoad: requireAuth,
	component: RouteComponent,
});

function RouteComponent() {
	const { marketId } = Route.useParams();

	return <Builder marketId={marketId} />;
}
