import { Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Bookmark,
	Bot,
	ChevronRight,
	Code2,
	Link2,
} from "lucide-react";
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
import { buildMarketChartPoints, getFiniteNumber } from "@/util/numbers.ts";
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
		error: orderBookError,
		isLoading: isOrderBookLoading,
		orderBook,
		refetch: refetchOrderBook,
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

								<div className="flex shrink-0 flex-wrap items-center gap-2">
									<IconButton label="Embed">
										<Code2 className="size-5" />
									</IconButton>
									<IconButton label="Copy link">
										<Link2 className="size-5" />
									</IconButton>
									<IconButton label="Save">
										<Bookmark className="size-5" />
									</IconButton>
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
							<PriceChart market={market} />
							<ChartTimeline />
            </Panel>


						{orderBookOutcomes.length > 0 ? (
							<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
								<MarketOrderBookPanel
									error={orderBookError}
									isLoading={isOrderBookLoading}
									onSelectedTokenIdChange={setSelectedTokenId}
									orderBook={orderBook}
									outcomes={orderBookOutcomes}
									selectedTokenId={activeTokenId}
									volume={normalizedMarket.volume}
								/>


								<MarketTradeTicket
									marketId={normalizedMarket.id}
									marketImage={normalizedMarket.image}
									marketTitle={normalizedMarket.title}
									onSelectedTokenIdChange={setSelectedTokenId}
									onTradeSubmitted={() => refetchOrderBook()}
									orderBook={orderBook}
									outcomes={orderBookOutcomes}
									selectedTokenId={activeTokenId}
								/>
							</div>
						) : null}

						<Panel className="p-5">
							<div className="flex gap-8 border-b border-app-border text-lg font-bold">
								<button
									className="border-b-2 border-primary pb-4 text-app-fg"
									type="button"
								>
									{AppKeyword.Rules}
								</button>
								<button className="pb-4 text-app-muted-fg" type="button">
									{AppKeyword.MarketContext}
								</button>
							</div>
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

					{/*<aside className="grid h-fit gap-5">
						<TopHoldersPnl />
						<OutcomePanel
							label={leadingOutcome.label}
							title={normalizedMarket.title}
						/>
						<AutomationPanel
							marketId={normalizedMarket.id}
							platformUrl={platformUrl}
						/>
						<RelatedCampaigns
							market={market}
							noPrice={noPrice}
							outcomeOne={outcomeOne}
							outcomeTwo={outcomeTwo}
						/>
					</aside>*/}
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

function IconButton({
	children,
	label,
}: {
	children: ReactNode;
	label: string;
}) {
	return (
		<button
			aria-label={label}
			className="grid size-10 place-items-center text-app-muted-fg transition hover:bg-app-muted hover:text-app-fg"
			type="button"
		>
			{children}
		</button>
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

function PriceChart({ market }: { market: PolymarketMarket }) {
	const basePrice =
		getFiniteNumber(market.lastTradePrice ?? market.bestBid) ?? 0.5;
	const points = buildMarketChartPoints(basePrice);
	const path = points.map((point) => `${point.x},${point.y}`).join(" ");

	return (
		<div className="relative mt-6 min-h-[360px] border-y border-app-border py-5">
			<div className="absolute inset-x-0 top-10 bottom-12 grid grid-rows-5">
				{Array.from({ length: 5 }).map((_, index) => (
					<div className="border-t border-app-border" key={index.toString()} />
				))}
			</div>
			<div className="absolute right-0 top-0 grid h-[314px] content-between text-sm font-semibold text-app-muted-fg">
				<span>$63,320</span>
				<span>$63,310</span>
				<span>$63,300</span>
				<span>$63,290</span>
				<span>$63,280</span>
				<span>$63,270</span>
			</div>
			<svg
				aria-label="Market price chart"
				className="relative z-10 h-[300px] w-[calc(100%-72px)] overflow-visible"
				preserveAspectRatio="none"
				viewBox="0 0 900 300"
			>
				<polyline
					fill="none"
					points={path}
					stroke="#ff8a00"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="4"
				/>
				<line
					stroke="#fdba74"
					strokeDasharray="7 8"
					strokeWidth="2"
					x1="0"
					x2="900"
					y1="230"
					y2="230"
				/>
				<line
					stroke="rgba(255,255,255,0.18)"
					strokeDasharray="8 8"
					strokeWidth="2"
					x1="0"
					x2="900"
					y1="248"
					y2="248"
				/>
				<circle
					cx={points.at(-1)?.x ?? 0}
					cy={points.at(-1)?.y ?? 0}
					fill="#ff8a00"
					r="5"
				/>
			</svg>
			<div className="mt-3 flex w-[calc(100%-72px)] justify-between text-sm font-medium text-app-muted-fg">
				<span>12:05 AM</span>
				<span>12:06 AM</span>
				<span>12:07 AM</span>
				<span>12:08 AM</span>
				<span>12:09 AM</span>
				<span>12:10 AM</span>
			</div>
		</div>
	);
}

function ChartTimeline() {
	return (
		<div className="mt-6 flex flex-wrap items-center gap-3">
			<TimePill active label={AppKeyword.Past} />
			<span className="h-8 w-px bg-app-muted" />
			<OutcomeDot tone="up" />
			<OutcomeDot tone="down" />
			<OutcomeDot tone="down" />
			<OutcomeDot tone="down" />
			<TimePill label="7:05 PM" />
			<TimePill active label="7:10 PM" />
			<TimePill label="7:15 PM" />
			<TimePill label="7:20 PM" />
			<TimePill label={AppKeyword.More} />
		</div>
	);
}

function TimePill({ active, label }: { active?: boolean; label: string }) {
	return (
		<button
			className={cn(
				"h-10 px-4 text-sm font-bold",
				active ? "bg-app-fg text-app-bg" : "bg-app-muted text-app-muted-fg",
			)}
			type="button"
		>
			{label}
		</button>
	);
}

function OutcomeDot({ tone }: { tone: "down" | "up" }) {
	return (
		<span
			className={cn(
				"grid size-8 place-items-center text-xs font-black text-app-fg",
				tone === "up" ? "bg-success" : "bg-danger",
			)}
		>
			{tone === "up" ? "UP" : "DN"}
		</span>
	);
}
