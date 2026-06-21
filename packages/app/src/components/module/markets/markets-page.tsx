import { Link } from "@tanstack/react-router";
import { Bolt, CheckCircle2, ChevronDown, Search } from "lucide-react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { AppKeyword } from "@/common";
import { AuthPanel } from "@/components/auth/auth-panel.tsx";
import { CustomModal } from "@/components/dialogs/custom-modal.tsx";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NoDataFound } from "@/components/misc/no-data-found.tsx";
import { ViewToggle } from "@/components/module/app-shell/product-shell.tsx";
import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Stepper } from "@/components/ui/stepper.tsx";
import { useConnectPolymarket, useCurrentUser } from "@/hooks/use-auth.ts";
import { usePolymarketMarkets } from "@/hooks/use-polymarket-markets.ts";
import { cn } from "@/lib/utils.ts";
import {
	type Market,
	normalizeMarket,
} from "@/packages/markets/market-utils.ts";
import { marketCategories } from "@/packages/markets/markets-data.ts";
import type {
	ConnectPolymarketRequest,
	VenueConnection,
} from "@/packages/types/auth.types.ts";
import {
	defaultVenueId,
	type VenueConfig,
	type VenueId,
	venues,
} from "@/packages/venues/venue-data.ts";

export function MarketsPage() {
	const [activeCategory, setActiveCategory] =
		useState<(typeof marketCategories)[number]>("All");
	const [search, setSearch] = useState("");
	const [venue, setVenue] = useState<VenueId>(defaultVenueId);
	const [isPlatformDialogOpen, setIsPlatformDialogOpen] = useState(false);
	const { user } = useCurrentUser();
	const { error, isLoading, markets } = usePolymarketMarkets();
	const selectedVenue = venues.find((item) => item.id === venue) ?? venues[0];
	const isVenueAvailable = selectedVenue.id === defaultVenueId;
	const connectedVenues = user?.venue_connections ?? [];
	const polymarketConnection = connectedVenues.find(
		(connection) => connection.venue === defaultVenueId && connection.enabled,
	);

	const normalizedMarkets = useMemo(
		() => (isVenueAvailable ? markets.map(normalizeMarket) : []),
		[isVenueAvailable, markets],
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
			<div className="w-full text-white">
				<section className="border-b border-white/10 pb-5">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div>
							<Typography className="text-white" variant="h2">
								{AppKeyword.Markets}
							</Typography>
							<Typography className="mt-1 max-w-2xl text-white/55" variant="bodySm">
								Browse venue markets, choose a platform, and build automations from
								one focused workspace.
							</Typography>
						</div>
						<ViewToggle />
					</div>

					<div className="mt-6 grid gap-4 xl:grid-cols-[auto_minmax(260px,420px)_minmax(0,1fr)] xl:items-center">
						<PlatformSelectorDialog
							connection={polymarketConnection}
							isAuthenticated={Boolean(user)}
							onOpenChange={setIsPlatformDialogOpen}
							onVenueChange={setVenue}
							open={isPlatformDialogOpen}
							selectedVenue={selectedVenue}
							trigger={
								<Button
									className="h-11 justify-between border border-white/10 bg-app-card px-4 text-sm font-semibold hover:border-primary/50 hover:bg-white/8 xl:min-w-55"
									type="button"
									variant="outline"
								>
									<span className="flex min-w-0 flex-col items-start gap-0.5">
										<span>Select Platform</span>
										<span className="max-w-37.5 truncate text-xs font-medium text-white/45">
											{selectedVenue.label}
										</span>
									</span>
									<ChevronDown className="size-4 text-white/55" />
								</Button>
							}
							venue={venue}
						/>

						<label className="flex h-11 w-full items-center gap-3 border border-white/10 bg-app-card px-4 text-white/55 focus-within:border-primary/60">
							<Search className="size-5" />
							<input
								className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/45 disabled:text-white/25"
								disabled={!isVenueAvailable}
								onChange={(event) => setSearch(event.target.value)}
								placeholder={`Search ${selectedVenue.label} markets...`}
								type="search"
								value={search}
							/>
						</label>

						<div className="flex flex-wrap gap-2 xl:justify-end">
							{marketCategories.map((category) => (
								<button
									className={cn(
										"h-9 px-4 text-sm font-medium transition",
										category === activeCategory
											? "bg-white text-black"
											: "bg-transparent text-white hover:bg-white/8",
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

					<div className="mt-4 flex flex-col gap-3 border border-white/10 bg-app-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<Typography className="text-white" variant="label">
								{selectedVenue.label}
							</Typography>
							<Typography className="mt-1 text-white/50" variant="bodySm">
								{selectedVenue.description}
							</Typography>
						</div>
						<ConnectionBadge connection={polymarketConnection} />
					</div>
				</section>

				<section className="grid gap-3 py-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
					{!isVenueAvailable && (
						<div className="border border-white/10 bg-app-card p-5 md:col-span-2 xl:col-span-3 2xl:col-span-4">
							<Typography className="text-white" variant="h3">
								{selectedVenue.label} is not available yet
							</Typography>
							<Typography className="mt-2 text-white/55" variant="bodySm">
								{selectedVenue.description}
							</Typography>
						</div>
					)}

					{isVenueAvailable && isLoading && (
						<>
							<MarketCardSkeleton />
							<MarketCardSkeleton />
							<MarketCardSkeleton />
							<MarketCardSkeleton />
						</>
					)}

					{isVenueAvailable && !isLoading && error && (
						<div className="border border-danger/40 bg-danger/10 p-5 md:col-span-2 xl:col-span-3 2xl:col-span-4">
							<Typography className="text-danger" variant="h3">
								Unable to load markets
							</Typography>
							<Typography className="mt-2 text-white/60" variant="bodySm">
								{error}
							</Typography>
						</div>
					)}

					{isVenueAvailable &&
						!isLoading &&
						!error &&
						filteredMarkets.length === 0 && (
							<NoDataFound
								className="md:col-span-2 xl:col-span-3 2xl:col-span-4"
								description="Try a different search or category."
								title="No markets found"
							/>
						)}

					{isVenueAvailable &&
						!isLoading &&
						!error &&
						filteredMarkets.map((market) => (
							<MarketCard key={market.id} market={market} />
						))}
				</section>
			</div>

		</DashboardLayout>
	);
}

function PlatformSelectorDialog({
	connection,
	isAuthenticated,
	onOpenChange,
	onVenueChange,
	open,
	selectedVenue,
	trigger,
	venue,
}: {
	connection?: VenueConnection;
	isAuthenticated: boolean;
	onOpenChange: (open: boolean) => void;
	onVenueChange: (venue: VenueId) => void;
	open: boolean;
	selectedVenue: VenueConfig;
	trigger: ReactNode;
	venue: VenueId;
}) {
	const [step, setStep] = useState(0);
	const steps = [
		{
			description: "Pick a venue",
			id: "platform",
			title: "Platform",
		},
		{
			description: "Review and connect",
			id: "details",
			title: "Details",
		},
	] as const;

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen);

		if (!nextOpen) {
			setStep(0);
		}
	}

	return (
		<CustomModal
			className="max-h-[86vh] overflow-hidden border-white/10 bg-app-card p-0 text-white shadow-2xl sm:max-w-3xl"
			description="Choose where you want to browse markets. Connect credentials only when you need authenticated trading actions."
			descriptionClassName="text-white/55"
			headerClassName="border-b border-white/10 p-6 pb-5"
			onOpenChange={handleOpenChange}
			open={open}
			showCloseButton
			title="Select platform"
			titleClassName="text-2xl text-white"
			trigger={trigger}
		>
			<div className="grid min-h-0 gap-5 overflow-y-auto p-5">
				<Stepper currentStep={step} onStepChange={setStep} steps={steps} />

				{step === 0 ? (
					<div className="grid gap-4">
						<div className="grid gap-3 sm:grid-cols-2">
							{venues.map((item) => (
								<PlatformOption
									connection={item.id === defaultVenueId ? connection : undefined}
									isSelected={item.id === venue}
									key={item.id}
									onSelect={() => onVenueChange(item.id)}
									venue={item}
								/>
							))}
						</div>

						<div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<Typography className="text-white" variant="label">
									Selected: {selectedVenue.label}
								</Typography>
								<Typography className="mt-1 text-white/50" variant="bodySm">
									{selectedVenue.description}
								</Typography>
							</div>
							<Button
								className="h-11 bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
								onClick={() => setStep(1)}
								type="button"
							>
								Continue
							</Button>
						</div>
					</div>
				) : (
					<div className="grid gap-4">
						<PlatformDetails
							connection={connection}
							isAuthenticated={isAuthenticated}
							venue={selectedVenue}
						/>
						<div className="border-t border-white/10 pt-5">
							<Button
								className="h-10 border border-white/10 bg-white/5 px-4 text-sm font-semibold hover:bg-white/10"
								onClick={() => setStep(0)}
								type="button"
								variant="outline"
							>
								Back to platforms
							</Button>
						</div>
					</div>
				)}
			</div>
		</CustomModal>
	);
}

function PlatformOption({
	connection,
	isSelected,
	onSelect,
	venue,
}: {
	connection?: VenueConnection;
	isSelected: boolean;
	onSelect: () => void;
	venue: VenueConfig;
}) {
	return (
		<button
			className={cn(
				"w-full border p-4 text-left transition",
				isSelected
					? "border-primary bg-primary/10"
					: "border-white/10 bg-black/20 hover:border-white/25 hover:bg-white/5",
			)}
			onClick={onSelect}
			type="button"
		>
			<div className="flex items-center justify-between gap-3">
				<div>
					<Typography className="text-white" variant="label">
						{venue.label}
					</Typography>
					<Typography className="mt-1 text-white/50" variant="bodySm">
						{venue.description}
					</Typography>
				</div>
				{isSelected && <CheckCircle2 className="size-5 shrink-0 text-primary" />}
			</div>
			<div className="mt-4">
				<ConnectionBadge connection={connection} />
			</div>
		</button>
	);
}

function PlatformDetails({
	connection,
	isAuthenticated,
	venue,
}: {
	connection?: VenueConnection;
	isAuthenticated: boolean;
	venue: VenueConfig;
}) {
	if (venue.id !== defaultVenueId) {
		return (
			<div className="border border-white/10 bg-black/20 p-5">
				<Typography className="text-white" variant="h3">
					{venue.label} support is coming soon
				</Typography>
				<Typography className="mt-2 text-white/55" variant="bodySm">
					{venue.description}
				</Typography>
			</div>
		);
	}

	return (
		<div className="grid gap-4">
			<div className="border border-white/10 bg-black/20 p-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<Typography className="text-white" variant="h3">
							Polymarket
						</Typography>
						<Typography className="mt-2 text-white/55" variant="bodySm">
							Browse public markets immediately. Add API credentials when you want
							to automate trading actions through Uptions.
						</Typography>
					</div>
					<ConnectionBadge connection={connection} />
				</div>
				{connection && (
					<div className="mt-4 border-t border-white/10 pt-4">
						<Typography className="text-white/45" variant="caption">
							Connected account
						</Typography>
						<Typography className="mt-1 break-all text-white" variant="bodySm">
							{connection.account_identifier}
						</Typography>
					</div>
				)}
			</div>
			<PolymarketConnectionForm isAuthenticated={isAuthenticated} />
		</div>
	);
}

function ConnectionBadge({ connection }: { connection?: VenueConnection }) {
	return (
		<span
			className={cn(
				"inline-flex w-fit items-center gap-2 px-3 py-1 text-xs font-semibold",
				connection ? "bg-success/15 text-success" : "bg-white/8 text-white/55",
			)}
		>
			<span className="size-1.5 bg-current" />
			{connection ? "Connected" : "Disconnected"}
		</span>
	);
}

function PolymarketConnectionForm({
	isAuthenticated,
}: {
	isAuthenticated: boolean;
}) {
	const connectPolymarket = useConnectPolymarket();
	const [form, setForm] = useState<ConnectPolymarketRequest>({
		api_key: "",
		passphrase: "",
		secret: "",
		signature_type: 3,
	});

	const isSubmitting = connectPolymarket.isPending;
	const error =
		connectPolymarket.error instanceof Error
			? connectPolymarket.error.message
			: null;

	function updateField(
		field: keyof ConnectPolymarketRequest,
		value: string | number | undefined,
	) {
		setForm((current) => ({
			...current,
			[field]: value,
		}));
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		connectPolymarket.mutate({
			...form,
			account_identifier: emptyToUndefined(form.account_identifier),
			funder: emptyToUndefined(form.funder),
		});
	}

	if (!isAuthenticated) {
		return <AuthPanel />;
	}

	return (
		<form
			className="grid gap-4 border border-white/10 bg-black/20 p-5"
			onSubmit={handleSubmit}
		>
			<div>
				<Typography className="text-white" variant="h3">
					Connect Polymarket
				</Typography>
				<Typography className="mt-2 text-white/55" variant="bodySm">
					Paste the API credentials created from Polymarket L1 auth.
				</Typography>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<ConnectionInput
					label="Polymarket account address"
					onChange={(value) => updateField("account_identifier", value)}
					required
					value={form.account_identifier ?? ""}
				/>
				<ConnectionInput
					label="API key"
					onChange={(value) => updateField("api_key", value)}
					required
					value={form.api_key}
				/>
				<ConnectionInput
					label="Secret"
					onChange={(value) => updateField("secret", value)}
					required
					type="password"
					value={form.secret}
				/>
				<ConnectionInput
					label="Passphrase"
					onChange={(value) => updateField("passphrase", value)}
					required
					type="password"
					value={form.passphrase}
				/>
				<ConnectionInput
					label="Funder address"
					onChange={(value) => updateField("funder", value)}
					value={form.funder ?? ""}
				/>
				<label className="grid gap-2">
					<span className="text-xs font-medium text-white/55">
						Signature type
					</span>
					<select
						className="h-11 border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-primary/60"
						onChange={(event) =>
							updateField("signature_type", Number(event.target.value))
						}
						value={form.signature_type}
					>
						<option value={0}>EOA</option>
						<option value={1}>POLY_PROXY</option>
						<option value={2}>GNOSIS_SAFE</option>
						<option value={3}>POLY_1271</option>
					</select>
				</label>
			</div>
			{error && (
				<Typography className="text-danger" variant="bodySm">
					{error}
				</Typography>
			)}
			<Button
				className="h-11 bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70 sm:w-fit sm:min-w-45"
				disabled={isSubmitting}
				type="submit"
			>
				{isSubmitting ? "Saving" : "Save Connection"}
			</Button>
		</form>
	);
}

function ConnectionInput({
	label,
	onChange,
	required,
	type = "text",
	value,
}: {
	label: string;
	onChange: (value: string) => void;
	required?: boolean;
	type?: "password" | "text";
	value: string;
}) {
	return (
		<label className="grid gap-2">
			<span className="text-xs font-medium text-white/55">{label}</span>
			<input
				className="h-11 border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-primary/60"
				onChange={(event) => onChange(event.target.value)}
				required={required}
				type={type}
				value={value}
			/>
		</label>
	);
}

function emptyToUndefined(value: string | undefined) {
	const trimmed = value?.trim();

	return trimmed ? trimmed : undefined;
}

function MarketCard({ market }: { market: Market }) {
	return (
		<article className="relative cursor-pointer border border-white/10 bg-app-card p-4 transition hover:border-primary/60">
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
						<span className="border border-white/10 bg-white/2 px-2 py-0.5 text-sm text-white">
							{market.category}
						</span>
						<Typography className="mt-4 text-white" variant="h3">
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

			<div className="pointer-events-none relative z-20 mt-5 flex items-center justify-between border-t border-white/10 pt-5">
				<Typography className="text-white/55" variant="bodySm">
					{AppKeyword.Volume}: {market.volume}
				</Typography>
				<Link
					className="pointer-events-auto inline-flex items-center gap-3 text-sm font-semibold text-white no-underline hover:text-primary"
					params={{ marketId: market.id }}
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
			<Typography className="text-white/55" variant="caption">
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

function MarketCardSkeleton() {
	return (
		<article className="border border-white/10 bg-app-card p-4">
			<div className="aspect-video w-full animate-pulse bg-white/8" />
			<div className="mt-4 h-5 w-24 animate-pulse bg-white/8" />
			<div className="mt-4 h-7 w-4/5 animate-pulse bg-white/8" />
			<div className="mt-10 grid grid-cols-2 gap-2">
				<div className="h-20.5 animate-pulse border border-white/10 bg-white/8" />
				<div className="h-20.5 animate-pulse border border-white/10 bg-white/8" />
			</div>
			<div className="mt-5 h-5 w-32 animate-pulse bg-white/8" />
		</article>
	);
}
