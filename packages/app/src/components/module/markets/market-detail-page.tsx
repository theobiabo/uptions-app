import { Link } from "@tanstack/react-router";
import { ArrowLeft, Bot, ChevronRight } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { AppKeyword, MarketDetailMetric } from "@/common";
import { DashboardLayout } from "@/components/layout/dashboard-layout.tsx";
import { NoDataFound } from "@/components/misc/no-data-found.tsx";
import { MarketOrderBookPanel } from "@/components/module/markets/order-book-panel.tsx";
import { MarketTradeTicket } from "@/components/module/trading/market-trade-ticket.tsx";
import { MarketPageSkeleton } from "@/components/skeleton/market-page-skeleton.tsx";
import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	usePolymarketMarket,
	usePolymarketOrderBook,
} from "@/hooks/use-polymarket-markets.ts";
import { cn } from "@/lib/utils.ts";
import { normalizeMarket } from "@/packages/markets/market-utils.ts";
import type { PolymarketMarket } from "@/packages/types/market.types.ts";
import { formatMarketPrice, formatMarketWindow } from "@/util/formatters.ts";

import { parseStringArray } from "@/util/strings.ts";

type MarketDetailPageProps = {
	marketId: string;
};

export function MarketDetailPage({ marketId }: MarketDetailPageProps) {
	const [selectedTokenId, setSelectedTokenId] = useState("");
	const { error, isLoading, market } = usePolymarketMarket(marketId);
	const normalizedMarket = market ? normalizeMarket(market) : null;
	const orderBookOutcomes = useMemo(
		() => (market ? createOrderBookOutcomes(market) : []),
		[market],
	);
	const activeTokenId = selectedTokenId || orderBookOutcomes[0]?.tokenId || "";
	const {
		connectionStatus: orderBookConnectionStatus,
		error: orderBookError,
		isLoading: isOrderBookLoading,
		isStale: isOrderBookStale,
		marketResolution,
		orderBook,
		refetch: refetchOrderBook,
		tickSizeChange,
	} = usePolymarketOrderBook(activeTokenId);

	useEffect(() => {
		if (!orderBookOutcomes.length) {
			return;
		}

		if (
			!orderBookOutcomes.some((outcome) => outcome.tokenId === selectedTokenId)
		) {
			setSelectedTokenId(orderBookOutcomes[0]?.tokenId ?? "");
		}
	}, [orderBookOutcomes, selectedTokenId]);

	if (isLoading) {
		return (
			<DashboardLayout contentClassName="px-5 py-8 sm:px-8">
				<MarketPageSkeleton />
			</DashboardLayout>
		);
	}

	if (error) {
		return (
			<DashboardLayout contentClassName="px-5 py-8 sm:px-8">
				<Panel className="border-danger/40 bg-danger/10">
					<Typography className="text-danger" variant="h3">
						Unable to load market
					</Typography>
					<Typography className="mt-2 text-app-muted-fg" variant="bodySm">
						{error}
					</Typography>
				</Panel>
			</DashboardLayout>
		);
	}

	if (!normalizedMarket || !market) {
		return (
			<DashboardLayout contentClassName="px-5 py-8 sm:px-8">
				<NoDataFound
					description="This market could not be found."
					title="Market unavailable"
				/>
			</DashboardLayout>
		);
	}

	const statusLabel =
		market.active && !market.closed ? AppKeyword.Live : AppKeyword.Inactive;
	const platformUrl = normalizedMarket.platformUrl;

	return (
		<DashboardLayout contentClassName="px-5 py-8 sm:px-8">
			<div
				className=" mx-auto grid w-full
        max-w-[1500px]
		 gap-5 text-app-fg"
			>
				<Link
					className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-app-muted-fg no-underline hover:text-app-fg"
					to="/markets"
				>
					<ArrowLeft className="size-4" />
					{AppKeyword.Markets}
				</Link>

				<section
					className="grid gap-5

				"
				>
					<div className="grid gap-5">
						<Panel className="p-5">
							<div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
								<div className="flex min-w-0 items-start gap-5">
									<MarketIcon
										image={normalizedMarket.image}
										title={normalizedMarket.title}
									/>
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-app-muted-fg">
											<span>{normalizedMarket.category}</span>
											<span className="h-1 w-1 bg-app-muted5" />
											<span
												className={cn(
													"inline-flex items-center gap-1",
													statusLabel === AppKeyword.Live
														? "text-success"
														: "text-app-muted-fg",
												)}
											>
												<span className="h-2 w-2 bg-current" />
												{statusLabel}
											</span>
										</div>
										<Typography className="mt-3 text-app-fg" variant="h1">
											{normalizedMarket.title}
										</Typography>
										<Typography
											className="mt-2 text-app-muted-fg"
											variant="bodySm"
										>
											{formatMarketWindow(market)}
										</Typography>
									</div>
								</div>
							</div>

							<div className="mt-8 grid gap-5 sm:grid-cols-3">
								<MarketValue
									label={MarketDetailMetric.BestBid}
									value={formatMarketPrice(market.bestBid)}
								/>
								<MarketValue
									label={MarketDetailMetric.BestAsk}
									value={formatMarketPrice(market.bestAsk)}
								/>
								<MarketValue
									label={MarketDetailMetric.LastTrade}
									trend={normalizedMarket.change}
									value={formatMarketPrice(market.lastTradePrice)}
								/>
							</div>
						</Panel>

						<Panel className="p-5">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<Typography className="text-app-fg" variant="h3">
									{AppKeyword.Market}
								</Typography>
								<div className="flex flex-wrap gap-2">
									{platformUrl && (
										<Button
											asChild
											className="h-10 border border-app-border bg-app-muted px-4 text-sm font-semibold hover:bg-app-muted"
										>
											<a href={platformUrl} rel="noreferrer" target="_blank">
												<span className="h-2 w-2 bg-danger" />
												{AppKeyword.GoToLiveMarket}
												<ChevronRight className="size-4" />
											</a>
										</Button>
									)}
									<Button
										asChild
										className="h-10 bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
									>
										<Link
											params={{ marketId: normalizedMarket.id }}
											search={{ automationId: undefined }}
											to="/$marketId/builder"
										>
											<Bot className="size-4" />
											{AppKeyword.AutomateMarket}
										</Link>
									</Button>
								</div>
							</div>
							<PriceHistoryUnavailable />
						</Panel>

						{orderBookOutcomes.length > 0 ? (
							<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
								<MarketOrderBookPanel
									connectionStatus={orderBookConnectionStatus}
									error={orderBookError}
									isLoading={isOrderBookLoading}
									isStale={isOrderBookStale}
									marketResolution={marketResolution}
									onSelectedTokenIdChange={setSelectedTokenId}
									orderBook={orderBook}
									outcomes={orderBookOutcomes}
									selectedTokenId={activeTokenId}
									tickSizeChange={tickSizeChange}
									volume={normalizedMarket.volume}
								/>

								<MarketTradeTicket
									marketId={normalizedMarket.id}
									marketResolved={Boolean(marketResolution)}
									negativeRisk={Boolean(market.negRisk)}
									marketImage={normalizedMarket.image}
									marketTitle={normalizedMarket.title}
									onSelectedTokenIdChange={setSelectedTokenId}
									onTradeSubmitted={() => refetchOrderBook()}
									orderBook={orderBook}
									outcomes={orderBookOutcomes}
									selectedTokenId={activeTokenId}
									tickSize={
										tickSizeChange?.newTickSize ?? market.orderPriceMinTickSize
									}
								/>
							</div>
						) : null}

						<Panel className="p-5">
							<Typography
								className="border-b border-app-border pb-4 text-app-fg"
								variant="h3"
							>
								{AppKeyword.Rules}
							</Typography>
							<Typography
								className="max-w-4xl py-6 text-app-muted-fg"
								variant="body"
							>
								{market.resolutionSource ??
									normalizedMarket.description ??
									"Resolution details are provided by the source market venue."}
							</Typography>
						</Panel>
					</div>
				</section>
			</div>
		</DashboardLayout>
	);
}

function createOrderBookOutcomes(market: PolymarketMarket) {
	const tokenIds = parseStringArray(market.clobTokenIds);
	const outcomes = parseStringArray(market.outcomes);

	return tokenIds.map((tokenId, index) => ({
		label: outcomes[index] ?? `Outcome ${index + 1}`,
		tokenId,
	}));
}

function Panel({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("border border-app-border bg-app-card", className)}>
			{children}
		</section>
	);
}

function MarketIcon({ image, title }: { image: string | null; title: string }) {
	if (image) {
		return (
			<img
				alt=""
				className="size-20 shrink-0 object-cover md:size-24"
				src={image}
			/>
		);
	}

	const isBitcoin =
		title.toLowerCase().includes("btc") ||
		title.toLowerCase().includes("bitcoin");

	return (
		<div className="grid size-20 shrink-0 place-items-center bg-orange-500 text-4xl font-black text-app-fg md:size-24">
			{isBitcoin ? "B" : title.charAt(0).toUpperCase()}
		</div>
	);
}

function MarketValue({
	label,
	trend,
	value,
}: {
	label: string;
	trend?: string;
	value: string;
}) {
	return (
		<div className="border border-app-border bg-app-muted p-4">
			<Typography className="font-bold text-app-muted-fg" variant="bodySm">
				{label}
			</Typography>
			<div className="mt-1 flex items-center gap-3">
				<p className="text-3xl font-bold text-app-fg">{value}</p>
				{trend && (
					<span className="text-sm font-bold text-danger">{trend}</span>
				)}
			</div>
		</div>
	);
}

function PriceHistoryUnavailable() {
	return (
		<div className="mt-6 border-y border-app-border bg-app-muted px-5 py-12 text-center">
			<Typography className="text-app-fg" variant="h3">
				Price history unavailable
			</Typography>
			<Typography
				className="mx-auto mt-2 max-w-xl text-app-muted-fg"
				variant="bodySm"
			>
				Historical chart data is not available from the current market feed.
				Live prices and order book data are shown below.
			</Typography>
		</div>
	);
}
