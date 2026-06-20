import { createFileRoute } from "@tanstack/react-router";
import MarketDetail from "@/pages/market-detail.tsx";
import { requireAuth } from "@/routes/-require-auth.ts";

export const Route = createFileRoute("/markets_/$marketId")({
	beforeLoad: requireAuth,
	component: RouteComponent,
});

function RouteComponent() {
	const { marketId } = Route.useParams();

	return <MarketDetail marketId={marketId} />;
}
