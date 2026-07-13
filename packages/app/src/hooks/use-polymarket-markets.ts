import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { ApiResponse } from "@/packages/types/api.types.ts";
import type {
	PolymarketMarketsQuery,
	PolymarketOrderBook,
} from "@/packages/types/market.types.ts";
import { marketService } from "@/services/market.service.ts";
import {
	applyPolymarketOrderBookEvent,
	eventTargetsAsset,
	getPolymarketEventFingerprint,
	getPolymarketEventTimestamp,
	getPolymarketMarketResolution,
	getPolymarketTickSizeChange,
	normalizePolymarketOrderBook,
	type PolymarketMarketEvent,
	type PolymarketMarketResolution,
	type PolymarketOrderBookConnectionStatus,
	type PolymarketTickSizeChange,
	polymarketOrderBookStreamService,
} from "@/services/polymarket-order-book-stream.service.ts";
import { getRequestErrorMessage } from "@/util/errors.ts";

const polymarketMarketsQueryKey = ["polymarket", "markets"] as const;
const polymarketMarketQueryKey = ["polymarket", "market"] as const;
const getPolymarketOrderBookQueryKey = (tokenId: string) =>
	["polymarket", "order-book", tokenId] as const;

type EventTimestampGroup = "order-book" | "resolution" | "tick-size";

export function usePolymarketOrderBook(tokenId?: string) {
	const queryClient = useQueryClient();
	const [connectionStatus, setConnectionStatus] =
		useState<PolymarketOrderBookConnectionStatus>(
			tokenId ? "connecting" : "disconnected",
		);
	const [marketResolution, setMarketResolution] =
		useState<PolymarketMarketResolution | null>(null);
	const [tickSizeChange, setTickSizeChange] =
		useState<PolymarketTickSizeChange | null>(null);
	const eventTimestamps = useRef<Partial<Record<EventTimestampGroup, number>>>(
		{},
	);
	const seenEvents = useRef(new Set<string>());
	const socketRevision = useRef(0);
	const orderBookQueryKey = getPolymarketOrderBookQueryKey(tokenId ?? "");
	const orderBookQuery = useQuery({
		enabled: Boolean(tokenId),
		queryFn: async ({ signal }) => {
			const requestRevision = socketRevision.current;
			const response = await marketService.fetchOrderBook(tokenId ?? "", {
				signal,
			});

			if (requestRevision !== socketRevision.current) {
				const current =
					queryClient.getQueryData<ApiResponse<PolymarketOrderBook>>(
						orderBookQueryKey,
					);
				if (current) {
					return current;
				}
			}

			return {
				...response,
				data: normalizePolymarketOrderBook(response.data),
			};
		},
		queryKey: orderBookQueryKey,
		refetchInterval: connectionStatus === "connected" ? false : 2500,
	});

	useEffect(() => {
		eventTimestamps.current = {};
		seenEvents.current.clear();
		socketRevision.current = 0;
		setMarketResolution(null);
		setTickSizeChange(null);

		if (!tokenId) {
			setConnectionStatus("disconnected");
			return;
		}

		setConnectionStatus("connecting");
		const queryKey = getPolymarketOrderBookQueryKey(tokenId);
		const refetchSnapshot = () => {
			void queryClient.refetchQueries({
				exact: true,
				queryKey,
				type: "active",
			});
		};

		return polymarketOrderBookStreamService.connect({
			assetId: tokenId,
			onEvent: (event) => {
				if (!eventTargetsAsset(event, tokenId)) {
					return;
				}

				const fingerprint = getPolymarketEventFingerprint(event);
				if (seenEvents.current.has(fingerprint)) {
					return;
				}

				const timestampGroup = getEventTimestampGroup(event);
				const timestamp = getPolymarketEventTimestamp(event);
				const lastTimestamp = eventTimestamps.current[timestampGroup];
				if (
					timestamp !== null &&
					lastTimestamp !== undefined &&
					timestamp < lastTimestamp
				) {
					return;
				}

				rememberEvent(seenEvents.current, fingerprint);
				if (timestamp !== null) {
					eventTimestamps.current[timestampGroup] = timestamp;
				}

				if (event.event_type === "tick_size_change") {
					setTickSizeChange(getPolymarketTickSizeChange(event));
					return;
				}

				if (event.event_type === "market_resolved") {
					setMarketResolution(getPolymarketMarketResolution(event));
					return;
				}

				const current =
					queryClient.getQueryData<ApiResponse<PolymarketOrderBook>>(queryKey);
				if (!current && event.event_type !== "book") {
					refetchSnapshot();
					return;
				}

				socketRevision.current += 1;
				queryClient.setQueryData<ApiResponse<PolymarketOrderBook>>(
					queryKey,
					(cached) => {
						const orderBook = applyPolymarketOrderBookEvent(
							cached?.data,
							event,
							tokenId,
						);
						if (!orderBook) {
							return cached;
						}

						return {
							data: orderBook,
							message:
								cached?.message ?? "Realtime order book received successfully",
							status_code: cached?.status_code ?? 200,
						};
					},
				);
			},
			onFallback: refetchSnapshot,
			onOpen: (isReconnect) => {
				if (isReconnect) {
					refetchSnapshot();
				}
			},
			onStatusChange: setConnectionStatus,
		});
	}, [queryClient, tokenId]);

	const orderBook = orderBookQuery.data?.data;
	return {
		connectionStatus,
		error: orderBook
			? null
			: getRequestErrorMessage(
					orderBookQuery.error,
					"Unable to fetch order book",
				),
		isLoading: orderBookQuery.isLoading && !orderBook,
		isStale: connectionStatus !== "connected",
		marketResolution,
		orderBook,
		refetch: orderBookQuery.refetch,
		tickSizeChange,
	};
}

function getEventTimestampGroup(
	event: PolymarketMarketEvent,
): EventTimestampGroup {
	if (event.event_type === "tick_size_change") {
		return "tick-size";
	}

	if (event.event_type === "market_resolved") {
		return "resolution";
	}

	return "order-book";
}

function rememberEvent(events: Set<string>, fingerprint: string) {
	if (events.size >= 500) {
		const oldest = events.values().next().value;
		if (oldest !== undefined) {
			events.delete(oldest);
		}
	}

	events.add(fingerprint);
}

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
