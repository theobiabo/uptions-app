import { Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Bookmark,
	Bot,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Code2,
	LineChart,
	Link2,
	SlidersHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";
import { AppKeyword, MarketDetailMetric } from "@/common";
import { DashboardLayout } from "@/components/layout/dashboard-layout.tsx";
import { NoDataFound } from "@/components/misc/no-data-found.tsx";
import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import { usePolymarketMarket } from "@/hooks/use-polymarket-markets.ts";
import { cn } from "@/lib/utils.ts";
import {
	normalizeMarket,
	parseStringArray,
} from "@/packages/markets/market-utils.ts";
import type { PolymarketMarket } from "@/packages/types/market.types.ts";

type MarketDetailPageProps = {
	marketId: string;
};

const marketTimeframes = ["5 Min", "15 Min", "1 Hour", "1 Day"] as const;

export function MarketDetailPage({ marketId }: MarketDetailPageProps) {
	const { error, isLoading, market } = usePolymarketMarket(marketId);
	const normalizedMarket = market ? normalizeMarket(market) : null;
	const outcomes = parseStringArray(market?.outcomes);

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
					<Typography className="mt-2 text-white/60" variant="bodySm">
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

	const outcomeOne = outcomes[0] ?? AppKeyword.Yes;
	const outcomeTwo = outcomes[1] ?? AppKeyword.No;
	const statusLabel =
		market.active && !market.closed ? AppKeyword.Live : AppKeyword.Inactive;
	const platformUrl = normalizedMarket.platformUrl;
	const leadingOutcome = getLeadingOutcome(market, outcomeOne, outcomeTwo);
	const noPrice = getNoPrice(market);

	return (
		<DashboardLayout contentClassName="px-5 py-8 sm:px-8">
			<div className="mx-auto grid w-full max-w-[1500px] gap-5 text-white">
				<Link
					className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/55 no-underline hover:text-white"
					to="/markets"
				>
					<ArrowLeft className="size-4" />
					{AppKeyword.Markets}
				</Link>

				<section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
					<div className="grid gap-5">
						<Panel className="p-5">
							<div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
								<div className="flex min-w-0 items-start gap-5">
									<MarketIcon
										image={normalizedMarket.image}
										title={normalizedMarket.title}
									/>
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white/50">
											<span>{normalizedMarket.category}</span>
											<span className="h-1 w-1 bg-white/25" />
											<span
												className={cn(
													"inline-flex items-center gap-1",
													statusLabel === AppKeyword.Live
														? "text-success"
														: "text-white/45",
												)}
											>
												<span className="h-2 w-2 bg-current" />
												{statusLabel}
											</span>
										</div>
										<Typography className="mt-3 text-white" variant="h1">
											{normalizedMarket.title}
										</Typography>
										<Typography className="mt-2 text-white/55" variant="bodySm">
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
								<Typography className="text-white" variant="h3">
									{AppKeyword.Market}
								</Typography>
								<div className="flex flex-wrap gap-2">
									{platformUrl && (
										<Button
											asChild
											className="h-10 border border-white/10 bg-white/5 px-4 text-sm font-semibold hover:bg-white/10"
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

						<OrderBook volume={normalizedMarket.volume} />

						<Panel className="p-5">
							<div className="flex gap-8 border-b border-white/10 text-lg font-bold">
								<button
									className="border-b-2 border-primary pb-4 text-white"
									type="button"
								>
									{AppKeyword.Rules}
								</button>
								<button className="pb-4 text-white/45" type="button">
									{AppKeyword.MarketContext}
								</button>
							</div>
							<Typography
								className="max-w-4xl py-6 text-white/60"
								variant="body"
							>
								{market.resolutionSource ??
									normalizedMarket.description ??
									"Resolution details are provided by the source market venue."}
							</Typography>
						</Panel>
					</div>

					<aside className="grid h-fit gap-5">
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
					</aside>
				</section>
			</div>
		</DashboardLayout>
	);
}

function Panel({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("border border-white/10 bg-app-card", className)}>
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
		<div className="grid size-20 shrink-0 place-items-center bg-orange-500 text-4xl font-black text-white md:size-24">
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
			className="grid size-10 place-items-center text-white/65 transition hover:bg-white/8 hover:text-white"
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
		<div className="border border-white/10 bg-white/[0.02] p-4">
			<Typography className="font-bold text-white/45" variant="bodySm">
				{label}
			</Typography>
			<div className="mt-1 flex items-center gap-3">
				<p className="text-3xl font-bold text-white">{value}</p>
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
	const points = buildChartPoints(basePrice);
	const path = points.map((point) => `${point.x},${point.y}`).join(" ");

	return (
		<div className="relative mt-6 min-h-[360px] border-y border-white/10 py-5">
			<div className="absolute inset-x-0 top-10 bottom-12 grid grid-rows-5">
				{Array.from({ length: 5 }).map((_, index) => (
					<div className="border-t border-white/8" key={index.toString()} />
				))}
			</div>
			<div className="absolute right-0 top-0 grid h-[314px] content-between text-sm font-semibold text-white/35">
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
			<div className="mt-3 flex w-[calc(100%-72px)] justify-between text-sm font-medium text-white/35">
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
			<span className="h-8 w-px bg-white/10" />
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
				active ? "bg-white text-black" : "bg-white/8 text-white/70",
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
				"grid size-8 place-items-center text-xs font-black text-white",
				tone === "up" ? "bg-success" : "bg-danger",
			)}
		>
			{tone === "up" ? "UP" : "DN"}
		</span>
	);
}

function OrderBook({ volume }: { volume: string }) {
	return (
		<Panel className="p-5">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<Typography className="text-white" variant="h3">
						{AppKeyword.OrderBook}
					</Typography>
					<span className="grid size-5 place-items-center bg-white/10 text-xs font-bold text-white/55">
						i
					</span>
				</div>
				<div className="flex items-center gap-4 text-lg font-semibold text-white/45">
					<span>
						{AppKeyword.Volume}: {volume}
					</span>
					<ChevronDown className="size-5 text-white" />
				</div>
			</div>
		</Panel>
	);
}

function TopHoldersPnl() {
	const columns = ["24H", "7D", "30D", "ALL"] as const;

	return (
		<Panel className="overflow-hidden">
			<div className="flex items-center justify-between gap-4 px-5 py-4">
				<Typography className="text-white" variant="h3">
					{AppKeyword.TopHoldersPnl}
				</Typography>
				<div className="flex items-center gap-2 text-sm font-bold text-white/35">
					<span>10</span>
					<span className="bg-white/10 px-2 py-1 text-white">20</span>
					<span>50</span>
				</div>
			</div>
			<div className="border-y border-white/10 bg-white/[0.03] px-5 py-3">
				<div className="grid grid-cols-[70px_repeat(4,1fr)] gap-2 text-center text-sm font-bold text-white/45">
					<span />
					{columns.map((column) => (
						<span key={column}>{column}</span>
					))}
				</div>
			</div>
			<div className="grid gap-4 px-5 py-4 text-sm font-bold">
				<PnlRow
					label={AppKeyword.Up}
					tone="up"
					values={["-$789.58", "-$1.2K", "-$7.9K", "-$28.0K"]}
				/>
				<PnlRow
					label={AppKeyword.Down}
					tone="down"
					values={["-$221.5K", "-$778.9K", "-$1.4M", "-$2.2M"]}
				/>
			</div>
		</Panel>
	);
}

function PnlRow({
	label,
	tone,
	values,
}: {
	label: string;
	tone: "down" | "up";
	values: string[];
}) {
	return (
		<div className="grid grid-cols-[70px_repeat(4,1fr)] gap-2 text-center">
			<span
				className={cn(
					"text-left",
					tone === "up" ? "text-success" : "text-danger",
				)}
			>
				{label}
			</span>
			{values.map((value) => (
				<span className="text-danger" key={`${label}-${value}`}>
					{value}
				</span>
			))}
		</div>
	);
}

function OutcomePanel({ label, title }: { label: string; title: string }) {
	return (
		<Panel className="p-8 text-center">
			<CheckCircle2 className="mx-auto size-16 text-info" />
			<p className="mt-6 text-2xl font-bold text-info">
				{AppKeyword.Outcome}: {label}
			</p>
			<p className="mt-5 text-lg leading-7 text-white/55">{title}</p>
		</Panel>
	);
}

function AutomationPanel({
	marketId,
	platformUrl,
}: {
	marketId: string;
	platformUrl: string | null;
}) {
	return (
		<Panel className="p-5">
			<Typography className="text-white" variant="h3">
				{AppKeyword.Automation}
			</Typography>
			<Typography className="mt-2 text-white/55" variant="bodySm">
				Use this market as the source for triggers, conditions, and execution
				rules.
			</Typography>
			<div className="mt-5 grid gap-3">
				<Button
					asChild
					className="h-11 bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
				>
					<Link params={{ marketId }} to="/$marketId/builder">
						<Bot className="size-4" />
						{AppKeyword.AutomateMarket}
					</Link>
				</Button>
				{platformUrl && (
					<Button
						asChild
						className="h-11 border border-white/10 bg-white/5 px-5 text-sm font-semibold hover:bg-white/10"
					>
						<a href={platformUrl} rel="noreferrer" target="_blank">
							{AppKeyword.OpenOnPolymarket}
						</a>
					</Button>
				)}
			</div>
		</Panel>
	);
}

function RelatedCampaigns({
	market,
	noPrice,
	outcomeOne,
	outcomeTwo,
}: {
	market: PolymarketMarket;
	noPrice: number | undefined;
	outcomeOne: string;
	outcomeTwo: string;
}) {
	return (
		<Panel className="p-5">
			<div className="flex items-center gap-2">
				<Button
					className="size-10 border border-white/10 bg-white/5 !text-white/65 hover:bg-white/10"
					size="icon"
				>
					<LineChart className="size-5" />
				</Button>
				<Button
					className="size-10 bg-primary/15 !text-primary hover:bg-primary/20"
					size="icon"
				>
					<span className="text-lg font-black">B</span>
				</Button>
				<Button
					className="size-10 border border-white/10 bg-white/5 !text-white/65 hover:bg-white/10"
					size="icon"
				>
					<SlidersHorizontal className="size-5" />
				</Button>
			</div>
			<div className="mt-4 flex flex-wrap gap-2">
				{marketTimeframes.map((timeframe) => (
					<button
						className={cn(
							"h-9 px-3 text-sm font-bold",
							timeframe === "1 Hour"
								? "bg-white text-black"
								: "bg-white/8 text-white/55",
						)}
						key={timeframe}
						type="button"
					>
						{timeframe}
					</button>
				))}
			</div>
			<div className="mt-5 grid gap-3">
				<RelatedMarket
					icon="B"
					label={`${outcomeOne} - June 19, 7PM ET`}
					percentage={formatOutcomePercent(market.bestBid)}
					tone="orange"
				/>
				<RelatedMarket
					icon="E"
					label={`${outcomeTwo} - June 19, 7PM ET`}
					percentage={formatOutcomePercent(noPrice)}
					tone="blue"
				/>
				<RelatedMarket
					icon="S"
					label="Solana Up or Down - June 19, 7PM ET"
					percentage="100%"
					tone="black"
				/>
			</div>
		</Panel>
	);
}

function RelatedMarket({
	icon,
	label,
	percentage,
	tone,
}: {
	icon: string;
	label: string;
	percentage: string;
	tone: "black" | "blue" | "orange";
}) {
	return (
		<div className="flex items-center justify-between gap-4 border border-white/10 bg-white/[0.02] p-3">
			<div className="flex min-w-0 items-center gap-3">
				<div
					className={cn(
						"grid size-11 shrink-0 place-items-center text-lg font-black text-white",
						tone === "orange" && "bg-primary",
						tone === "blue" && "bg-info",
						tone === "black" && "bg-black",
					)}
				>
					{icon}
				</div>
				<p className="min-w-0 text-sm font-bold leading-6 text-white">
					{label}
				</p>
			</div>
			<div className="shrink-0 text-right">
				<p className="text-xl font-bold text-white">
					<span className="mr-2 inline-block size-2 bg-danger" />
					{percentage}
				</p>
				<p className="text-xs font-semibold text-white/40">Up</p>
			</div>
		</div>
	);
}

function MarketPageSkeleton() {
	return (
		<div className="mx-auto grid max-w-[1500px] gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
			<div className="grid gap-5">
				<div className="h-40 animate-pulse border border-white/10 bg-white/8" />
				<div className="h-[480px] animate-pulse border border-white/10 bg-white/8" />
			</div>
			<div className="h-[680px] animate-pulse border border-white/10 bg-white/8" />
		</div>
	);
}

function formatMarketWindow(market: PolymarketMarket) {
	const start = formatDate(market.startDate);
	const end = formatDate(market.endDate);

	if (start && end) {
		return `${start}-${end}`;
	}

	return start ?? end ?? "Market schedule unavailable";
}

function formatDate(value: string | undefined) {
	if (!value) {
		return null;
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
}

function formatMarketPrice(value: number | string | undefined) {
	const numberValue = getFiniteNumber(value);

	if (numberValue === null) {
		return "$0.00";
	}

	return `$${numberValue.toFixed(2)}`;
}

function formatOutcomePercent(value: number | string | undefined) {
	const numberValue = getFiniteNumber(value);

	if (numberValue === null) {
		return "0%";
	}

	return `${Math.round(numberValue * 100)}%`;
}

function getNoPrice(market: PolymarketMarket) {
	const lastTradePrice = getFiniteNumber(market.lastTradePrice);

	if (lastTradePrice !== null) {
		return 1 - lastTradePrice;
	}

	const bestAsk = getFiniteNumber(market.bestAsk);

	if (bestAsk !== null) {
		return 1 - bestAsk;
	}

	return undefined;
}

function getLeadingOutcome(
	market: PolymarketMarket,
	outcomeOne: string,
	outcomeTwo: string,
) {
	const yesPrice =
		getFiniteNumber(market.bestBid ?? market.lastTradePrice) ?? 0;
	const noPrice = getFiniteNumber(getNoPrice(market)) ?? 0;

	return yesPrice >= noPrice
		? { label: outcomeOne, price: yesPrice }
		: { label: outcomeTwo, price: noPrice };
}

function getFiniteNumber(value: number | string | undefined) {
	const numberValue =
		typeof value === "string" ? Number.parseFloat(value) : value;

	return typeof numberValue === "number" && Number.isFinite(numberValue)
		? numberValue
		: null;
}

function buildChartPoints(basePrice: number) {
	const clamped = Math.min(Math.max(basePrice, 0.05), 0.95);

	return Array.from({ length: 12 }).map((_, index) => {
		const x = (index / 11) * 900;
		const wave = Math.sin(index * 0.85) * 36 + Math.cos(index * 0.35) * 24;
		const y = 250 - clamped * 120 + wave;

		return { x, y: Math.min(Math.max(y, 45), 260) };
	});
}
