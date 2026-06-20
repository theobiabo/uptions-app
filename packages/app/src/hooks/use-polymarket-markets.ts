import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/components/errors/api.error.ts";
import type { PolymarketMarketsQuery } from "@/packages/types/market.types.ts";
import { marketService } from "@/services/market.service.ts";

const polymarketMarketsQueryKey = ["polymarket", "markets"] as const;
const polymarketMarketQueryKey = ["polymarket", "market"] as const;

export function usePolymarketMarket(marketId?: string) {
	const marketQuery = useQuery({
		enabled: Boolean(marketId),
		queryFn: ({ signal }) =>
			marketService.fetchMarket(marketId ?? "", { signal }),
		queryKey: [polymarketMarketQueryKey, marketId],
	});

	return {
		error:
			marketQuery.error instanceof ApiError
				? marketQuery.error.message
				: marketQuery.error
					? "Unable to fetch market"
					: null,
		isLoading: marketQuery.isLoading,
		market: marketQuery.data?.data,
		refetch: marketQuery.refetch,
	};
}

export function usePolymarketMarkets(query: PolymarketMarketsQuery = {}) {
	const marketsQuery = useQuery({
		queryFn: ({ signal }) => marketService.fetchMarketData(query, { signal }),
		queryKey: [polymarketMarketsQueryKey, query],
	});

	return {
		error:
			marketsQuery.error instanceof ApiError
				? marketsQuery.error.message
				: marketsQuery.error
					? "Unable to fetch markets"
					: null,
		isLoading: marketsQuery.isLoading,
		markets: marketsQuery.data?.data ?? [],
		refetch: marketsQuery.refetch,
	};
}
