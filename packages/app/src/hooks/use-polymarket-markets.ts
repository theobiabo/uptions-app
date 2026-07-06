import { useQuery } from "@tanstack/react-query";
import type { PolymarketMarketsQuery } from "@/packages/types/market.types.ts";
import { marketService } from "@/services/market.service.ts";
import { getRequestErrorMessage } from "@/util/errors.ts";

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
		error: getRequestErrorMessage(marketQuery.error, "Unable to fetch market"),
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
		error: getRequestErrorMessage(
			marketsQuery.error,
			"Unable to fetch markets",
		),
		isLoading: marketsQuery.isLoading,
		markets: marketsQuery.data?.data ?? [],
		refetch: marketsQuery.refetch,
	};
}
