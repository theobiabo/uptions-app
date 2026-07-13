import { Link } from "@tanstack/react-router";
import { Bolt, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppKeyword } from "@/common";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NoDataFound } from "@/components/misc/no-data-found.tsx";
import { ViewToggle } from "@/components/module/app-shell/product-shell.tsx";
import { MarketCardSkeleton } from "@/components/skeleton/market-card-skeleton.tsx";
import { Typography } from "@/components/typography/typography.tsx";
import { useCurrentUser } from "@/hooks/use-auth.ts";
import { usePolymarketMarkets } from "@/hooks/use-polymarket-markets.ts";
import { cn } from "@/lib/utils.ts";
import {
	type Market,
	normalizeMarket,
} from "@/packages/markets/market-utils.ts";
import { marketCategories } from "@/packages/markets/markets-data.ts";
import type { VenueConnection } from "@/packages/types/auth.types.ts";
import {
	defaultVenueId,
	getVenueConfig,
} from "@/packages/venues/venue-data.ts";

export function MarketsPage() {
	const [activeCategory, setActiveCategory] =
		useState<(typeof marketCategories)[number]>("All");
	const [search, setSearch] = useState("");
	const { user } = useCurrentUser();
	const { error, isLoading, markets } = usePolymarketMarkets();
	const selectedVenue = getVenueConfig(defaultVenueId);
	const polymarketConnection = (user?.venue_connections ?? []).find(
		(connection) => connection.venue === defaultVenueId && connection.enabled,
	);
	const normalizedMarkets = useMemo(
		() => markets.map(normalizeMarket),
		[markets],
	);
	const filteredMarkets = useMemo(() => {
		const searchValue = search.trim().toLowerCase();

		return normalizedMarkets.filter((market) => {
			const matchesCategory =
				activeCategory === "All" || market.category === activeCategory;
			const matchesSearch =
				searchValue.length === 0 ||
				market.title.toLowerCase().includes(searchValue);

			return matchesCategory && matchesSearch;
		});
	}, [activeCategory, normalizedMarkets, search]);

	return (
		<DashboardLayout contentClassName="px-5 py-8 sm:px-8">
			<div className="w-full text-app-fg">
				<section className="border-b border-app-border pb-5">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div>
							<Typography className="text-app-fg" variant="h2">
								{AppKeyword.Markets}
							</Typography>
							<Typography
								className="mt-1 max-w-2xl text-app-muted-fg"
								variant="bodySm"
							>
								Browse live Polymarket markets and build automations from one
								focused workspace.
							</Typography>
						</div>
						<ViewToggle />
					</div>

					<div className="mt-6 grid gap-4 xl:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] xl:items-center">
						<label className="flex h-11 w-full items-center gap-3 border border-app-border bg-app-card px-4 text-app-muted-fg focus-within:border-primary/60">
							<Search className="size-5" />
							<span className="sr-only">Search markets</span>
							<input
								className="min-w-0 flex-1 bg-transparent text-base text-app-fg outline-none placeholder:text-app-muted-fg"
								onChange={(event) => setSearch(event.target.value)}
								placeholder={`Search ${selectedVenue.label} markets...`}
								type="search"
								value={search}
							/>
						</label>

						<div className="flex flex-wrap gap-2 xl:justify-end">
							{marketCategories.map((category) => (
								<button
									aria-pressed={category === activeCategory}
									className={cn(
										"h-9 px-4 text-sm font-medium transition",
										category === activeCategory
											? "bg-app-fg text-app-bg"
											: "bg-transparent text-app-fg hover:bg-app-muted",
									)}
									key={category}
									onClick={() => setActiveCategory(category)}
									type="button"
								>
									{category}
								</button>
							))}
						</div>
					</div>

					<div className="mt-4 flex flex-col gap-3 border border-app-border bg-app-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<Typography className="text-app-fg" variant="label">
								{selectedVenue.label}
							</Typography>
							<Typography className="mt-1 text-app-muted-fg" variant="bodySm">
								{selectedVenue.description}
							</Typography>
						</div>
						<ConnectionBadge connection={polymarketConnection} />
					</div>
				</section>

				<section className="grid gap-3 py-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
					{isLoading ? (
						<>
							<MarketCardSkeleton />
							<MarketCardSkeleton />
							<MarketCardSkeleton />
							<MarketCardSkeleton />
						</>
					) : error ? (
						<div className="border border-danger/40 bg-danger/10 p-5 md:col-span-2 xl:col-span-3 2xl:col-span-4">
							<Typography className="text-danger" variant="h3">
								Unable to load markets
							</Typography>
							<Typography className="mt-2 text-app-muted-fg" variant="bodySm">
								{error}
							</Typography>
						</div>
					) : filteredMarkets.length === 0 ? (
						<NoDataFound
							className="md:col-span-2 xl:col-span-3 2xl:col-span-4"
							description="Try a different search or category."
							title="No markets found"
						/>
					) : (
						filteredMarkets.map((market) => (
							<MarketCard key={market.id} market={market} />
						))
					)}
				</section>
			</div>
		</DashboardLayout>
	);
}

function ConnectionBadge({ connection }: { connection?: VenueConnection }) {
	return (
		<span
			className={cn(
				"inline-flex w-fit items-center gap-2 px-3 py-1 text-xs font-semibold",
				connection
					? "bg-success/15 text-success"
					: "bg-app-muted text-app-muted-fg",
			)}
		>
			<span className="size-1.5 bg-current" />
			{connection ? "Connected" : "Public data"}
		</span>
	);
}

function MarketCard({ market }: { market: Market }) {
	return (
		<article className="relative cursor-pointer border border-app-border bg-app-card p-4 transition hover:border-primary/60">
			<Link
				aria-label={market.title}
				className="absolute inset-0 z-10 outline-none focus-visible:ring-2 focus-visible:ring-primary"
				params={{ marketId: market.id }}
				to="/markets/$marketId"
			/>
			<div className="pointer-events-none relative z-0">
				{market.image && (
					<img
						alt=""
						className="mb-4 aspect-video w-full object-cover"
						src={market.image}
					/>
				)}
				<div className="flex items-start justify-between gap-4">
					<div>
						<span className="border border-app-border bg-app-muted px-2 py-0.5 text-sm text-app-fg">
							{market.category}
						</span>
						<Typography className="mt-4 text-app-fg" variant="h3">
							{market.title}
						</Typography>
					</div>
					<Typography
						className={market.positive ? "text-success" : "text-danger"}
						variant="label"
					>
						{market.positive ? "↗" : "↘"} {market.change}
					</Typography>
				</div>

				<div className="mt-10 grid grid-cols-2 gap-2">
					<OutcomeCard label={AppKeyword.Yes} value={market.yes} tone="yes" />
					<OutcomeCard label={AppKeyword.No} value={market.no} tone="no" />
				</div>
			</div>

			<div className="pointer-events-none relative z-20 mt-5 flex items-center justify-between border-t border-app-border pt-5">
				<Typography className="text-app-muted-fg" variant="bodySm">
					{AppKeyword.Volume}: {market.volume}
				</Typography>
				<Link
					className="pointer-events-auto inline-flex items-center gap-3 text-sm font-semibold text-app-fg no-underline hover:text-primary"
					params={{ marketId: market.id }}
					search={{ automationId: undefined }}
					to="/$marketId/builder"
				>
					<Bolt className="size-5" />
					Build
				</Link>
			</div>
		</article>
	);
}

function OutcomeCard({
	label,
	tone,
	value,
}: {
	label: string;
	tone: "no" | "yes";
	value: string;
}) {
	return (
		<div
			className={cn(
				"border p-3",
				tone === "yes"
					? "border-success/45 bg-success/8"
					: "border-danger/45 bg-danger/10",
			)}
		>
			<Typography className="text-app-muted-fg" variant="caption">
				{label}
			</Typography>
			<Typography
				className={cn(
					"mt-1 text-2xl font-bold",
					tone === "yes" ? "text-success" : "text-danger",
				)}
				variant="h2"
			>
				{value}
			</Typography>
		</div>
	);
}
