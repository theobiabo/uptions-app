import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircle2, ChevronDown, ShieldAlert, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount, useWalletClient } from "wagmi";
import { AuthPanel } from "@/components/auth/auth-panel.tsx";
import { CustomModal } from "@/components/dialogs/custom-modal.tsx";
import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	useConnectPolymarket,
	useCurrentUser,
	useUpdateWallet,
} from "@/hooks/use-auth.ts";
import { usePolymarketReadiness } from "@/hooks/use-polymarket-readiness.ts";
import {
	useCreateTradeIntent,
	useSubmitSignedTrade,
} from "@/hooks/use-trades.ts";
import { cn } from "@/lib/utils.ts";
import {
	supportedChain,
	tradingProvider,
} from "@/packages/types/auth.types.ts";
import type { PolymarketOrderBook } from "@/packages/types/market.types.ts";
import {
	polymarketExecutionType,
	type TradeOrderType,
	type TradeSide,
	tradeOrderType,
	tradeSide,
} from "@/packages/types/trade.types.ts";
import {
	createOrDerivePolymarketCredentials,
	createSignedPolymarketOrder,
	getPolymarketLimitBuyPreview,
	normalizePolymarketShares,
	normalizePolymarketTickSize,
} from "@/services/polymarket-trading.service.ts";
import { getRequestErrorMessage } from "@/util/errors.ts";

export type TradeTicketOutcome = {
	label: string;
	tokenId: string;
};

type MarketTradeTicketProps = {
	marketId: string;
	marketImage?: string | null;
	marketResolved?: boolean;
	marketTitle: string;
	negativeRisk: boolean;
	onSelectedTokenIdChange: (tokenId: string) => void;
	onTradeSubmitted?: () => void;
	orderBook?: PolymarketOrderBook | null;
	outcomes: TradeTicketOutcome[];
	selectedTokenId: string;
	tickSize?: number | string;
};

const quickAmounts = [1, 5, 10, 100];

export function MarketTradeTicket({
	marketId,
	marketImage,
	marketResolved = false,
	marketTitle,
	negativeRisk,
	onSelectedTokenIdChange,
	onTradeSubmitted,
	orderBook,
	outcomes,
	selectedTokenId,
	tickSize,
}: MarketTradeTicketProps) {
	const [amount, setAmount] = useState("");
	const [authOpen, setAuthOpen] = useState(false);
	const [limitPrice, setLimitPrice] = useState("");
	const [orderType, setOrderType] = useState<TradeOrderType>(
		tradeOrderType.market,
	);
	const [side, setSide] = useState<TradeSide>(tradeSide.buy);
	const { address, chainId, isConnected } = useAccount();
	const walletClient = useWalletClient();
	const { user } = useCurrentUser();
	const connectPolymarket = useConnectPolymarket();
	const createTradeIntent = useCreateTradeIntent();
	const submitSignedTrade = useSubmitSignedTrade();
	const updateWallet = useUpdateWallet();
	const selectedOutcome = useMemo(
		() =>
			outcomes.find((outcome) => outcome.tokenId === selectedTokenId) ??
			outcomes[0],
		[outcomes, selectedTokenId],
	);
	const numericAmount = Number(amount);
	const numericLimitPrice = Number(limitPrice) / 100;
	const normalizedTickSize = normalizePolymarketTickSize(tickSize);
	const limitBuyPreview = getPolymarketLimitBuyPreview({
		collateralAmount: numericAmount,
		price: numericLimitPrice,
		tickSize: normalizedTickSize,
	});
	const marketPrice =
		side === tradeSide.buy ? orderBook?.best_ask : orderBook?.best_bid;
	const effectivePrice =
		orderType === tradeOrderType.limit ? numericLimitPrice : marketPrice;
	const estimatedShares =
		Number.isFinite(numericAmount) &&
		numericAmount > 0 &&
		effectivePrice &&
		effectivePrice > 0
			? side === tradeSide.buy
				? orderType === tradeOrderType.limit
					? limitBuyPreview.shares
					: numericAmount / effectivePrice
				: normalizePolymarketShares(numericAmount)
			: 0;
	const requiredCollateral =
		side === tradeSide.buy
			? orderType === tradeOrderType.limit
				? limitBuyPreview.collateral
				: normalizePolymarketShares(numericAmount)
			: 0;
	const requiredShares =
		side === tradeSide.sell ? normalizePolymarketShares(numericAmount) : 0;
	const walletReadiness = usePolymarketReadiness({
		address,
		chainId,
		isConnected,
		negativeRisk,
		requiredCollateral,
		requiredShares,
		side,
		tokenId: selectedOutcome?.tokenId ?? "",
	});
	const submitPending =
		connectPolymarket.isPending ||
		createTradeIntent.isPending ||
		submitSignedTrade.isPending ||
		updateWallet.isPending;

	const handleQuickAmount = (value: number) => {
		const current = Number(amount);
		setAmount(String((Number.isFinite(current) ? current : 0) + value));
	};

	const handleTrade = async () => {
		if (marketResolved) {
			toast.error("This market is resolved and no longer accepts orders.");
			return;
		}

		if (!user) {
			setAuthOpen(true);
			return;
		}

		if (!user.preferred_trading_provider) {
			toast.error("Select a trading provider before trading.");
			return;
		}

		if (!isConnected || !address) {
			toast.error("Connect your wallet before trading.");
			return;
		}

		if (chainId !== 137) {
			toast.error("Switch your wallet to Polygon before trading.");
			return;
		}

		if (!walletClient.data) {
			toast.error("Wallet client is unavailable.");
			return;
		}

		if (!selectedOutcome) {
			toast.error("Select an outcome before trading.");
			return;
		}

		if (!walletReadiness.readiness.ready) {
			toast.error(walletReadiness.readiness.reason);
			return;
		}

		if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
			toast.error("Enter a valid trade amount.");
			return;
		}

		if (orderType === tradeOrderType.limit) {
			if (
				!Number.isFinite(numericLimitPrice) ||
				numericLimitPrice <= 0 ||
				numericLimitPrice >= 1
			) {
				toast.error("Enter a limit price between 1¢ and 99¢.");
				return;
			}
		}

		try {
			await updateWallet.mutateAsync({
				chain: supportedChain.polygon,
				chain_id: 137,
				provider: tradingProvider.polymarket,
				wallet_address: address,
			});

			const executionType =
				orderType === tradeOrderType.market
					? polymarketExecutionType.fok
					: polymarketExecutionType.gtc;
			const intentAmount =
				orderType === tradeOrderType.limit && side === tradeSide.buy
					? limitBuyPreview.shares
					: numericAmount;
			const intent = await createTradeIntent.mutateAsync({
				amount: intentAmount,
				execution_type: executionType,
				market_id: marketId,
				market_title: marketTitle,
				order_type: orderType,
				outcome: selectedOutcome.label,
				price:
					orderType === tradeOrderType.limit ? limitBuyPreview.price : null,
				provider: tradingProvider.polymarket,
				side,
				token_id: selectedOutcome.tokenId,
				wallet_address: address,
			});
			const creds = await createOrDerivePolymarketCredentials(
				walletClient.data,
			);
			await connectPolymarket.mutateAsync({
				account_identifier: address,
				api_key: creds.key,
				funder: address,
				passphrase: creds.passphrase,
				permissions: {
					automation: false,
					read: true,
					trade: true,
				},
				secret: creds.secret,
				signature_type: 0,
			});
			const signedOrderAmount = getSignedOrderAmount({
				amount: numericAmount,
				limitBuyShares: limitBuyPreview.shares,
				orderType,
				side,
			});
			const signedOrder = await createSignedPolymarketOrder(
				walletClient.data,
				creds,
				{
					amount: signedOrderAmount,
					executionType,
					feeRateBps: intent.data.token_metadata.fee_rate_bps,
					negativeRisk: intent.data.token_metadata.negative_risk,
					orderType,
					price:
						orderType === tradeOrderType.limit
							? limitBuyPreview.price
							: undefined,
					side,
					tickSize: intent.data.token_metadata.tick_size,
					tokenId: selectedOutcome.tokenId,
				},
			);

			await submitSignedTrade.mutateAsync({
				payload: {
					execution_type: executionType,
					signed_order: signedOrder as unknown as Record<string, unknown>,
				},
				tradeId: intent.data.trade.id,
			});
			setAmount("");
			setLimitPrice("");
			onTradeSubmitted?.();
			toast.success("Trade submitted to Polymarket");
		} catch (error) {
			const message = getRequestErrorMessage(error, "Unable to submit trade");
			toast.error(message ?? "Unable to submit trade");
		}
	};

	return (
		<aside className="border border-app-border bg-app-card">
			<div className="flex items-start gap-4 border-b border-app-border p-5">
				<MarketImage image={marketImage} title={marketTitle} />
				<div className="min-w-0 flex-1">
					<Typography
						className="line-clamp-2 text-app-muted-fg"
						variant="bodySm"
					>
						{marketTitle}
					</Typography>
					<div className="mt-1 flex min-w-0 items-center gap-2">
						<Typography className="truncate text-app-fg" variant="h3">
							{selectedOutcome?.label ?? "Outcome"}
						</Typography>
						<span className="text-app-muted-fg">·</span>
						<span
							className={cn(
								"text-lg font-bold",
								side === tradeSide.buy ? "text-success" : "text-danger",
							)}
						>
							{side === tradeSide.buy ? "Buy" : "Sell"}
						</span>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between border-b border-app-border px-5 pt-4">
				<div className="flex gap-6 text-lg font-bold">
					<TabButton
						active={side === tradeSide.buy}
						onClick={() => setSide(tradeSide.buy)}
					>
						Buy
					</TabButton>
					<TabButton
						active={side === tradeSide.sell}
						onClick={() => setSide(tradeSide.sell)}
					>
						Sell
					</TabButton>
				</div>
				<button
					className="mb-3 inline-flex items-center gap-2 text-base font-bold text-app-fg"
					onClick={() =>
						setOrderType((current) =>
							current === tradeOrderType.market
								? tradeOrderType.limit
								: tradeOrderType.market,
						)
					}
					type="button"
				>
					{orderType === tradeOrderType.market ? "Market" : "Limit"}
					<ChevronDown className="size-4" />
				</button>
			</div>

			<div className="grid gap-5 p-5">
				<div className="grid grid-cols-2 gap-3">
					{outcomes.map((outcome) => (
						<Button
							className={cn(
								"h-14 border border-app-border text-base font-bold",
								outcome.tokenId === selectedOutcome?.tokenId
									? side === tradeSide.buy
										? "bg-success text-white hover:bg-success/90"
										: "bg-danger text-white hover:bg-danger/90"
									: "bg-app-muted text-app-muted-fg hover:bg-app-muted",
							)}
							key={outcome.tokenId}
							onClick={() => onSelectedTokenIdChange(outcome.tokenId)}
							type="button"
						>
							{outcome.label}{" "}
							{formatPrice(
								getOutcomePrice(
									outcome.tokenId,
									selectedOutcome?.tokenId,
									orderBook,
									side,
								),
							)}
						</Button>
					))}
				</div>

				<div className="grid gap-2">
					<div className="flex items-center justify-between">
						<label
							className="text-sm font-bold text-app-fg"
							htmlFor="trade-amount"
						>
							{side === tradeSide.buy ? "Amount" : "Shares"}
						</label>
						<span className="text-xs font-semibold text-app-muted-fg">
							{side === tradeSide.buy ? "USDC.e" : "Outcome shares"}
						</span>
					</div>
					<input
						className="h-16 border border-app-border bg-app-muted px-4
						text-right text-xl font-bold"
						id="trade-amount"
						inputMode="decimal"
						onChange={(event) => setAmount(event.target.value)}
						placeholder={side === tradeSide.buy ? "$0" : "0"}
						value={amount}
					/>
					<div className="flex flex-wrap justify-end gap-2">
						{quickAmounts.map((value) => (
							<button
								className="h-9 bg-app-muted px-4 text-sm font-bold text-app-muted-fg hover:text-app-fg"
								key={value}
								onClick={() => handleQuickAmount(value)}
								type="button"
							>
								+{side === tradeSide.buy ? `$${value}` : value}
							</button>
						))}
					</div>
				</div>

				{orderType === tradeOrderType.limit ? (
					<div className="grid gap-2">
						<label
							className="text-sm font-bold text-app-fg"
							htmlFor="limit-price"
						>
							Limit price
						</label>
						<input
							className="h-12 border border-app-border bg-app-muted px-4 text-right text-xl font-bold text-app-fg outline-none focus:border-primary"
							id="limit-price"
							inputMode="decimal"
							onChange={(event) => setLimitPrice(event.target.value)}
							placeholder="50¢"
							value={limitPrice}
						/>
					</div>
				) : null}

				<div className="grid gap-2 border-y border-app-border py-4 text-sm font-semibold">
					<SummaryRow
						label="Best ask"
						value={formatPrice(orderBook?.best_ask)}
					/>
					<SummaryRow
						label="Best bid"
						value={formatPrice(orderBook?.best_bid)}
					/>
					{orderType === tradeOrderType.limit ? (
						<SummaryRow
							label="Normalized limit price"
							value={formatPrice(limitBuyPreview.price)}
						/>
					) : null}
					<SummaryRow
						label={
							orderType === tradeOrderType.limit
								? "Normalized shares"
								: "Estimated shares"
						}
						value={formatNumber(estimatedShares)}
					/>
					{orderType === tradeOrderType.limit && side === tradeSide.buy ? (
						<SummaryRow
							label="Normalized USDC.e total"
							value={`$${formatNumber(limitBuyPreview.collateral)}`}
						/>
					) : null}
				</div>

				<div className="grid gap-3 border border-app-border bg-app-muted p-4">
					<div className="flex items-start gap-3">
						{walletReadiness.readiness.ready ? (
							<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
						) : (
							<ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
						)}
						<div>
							<p className="text-sm font-bold text-app-fg">
								EOA-only private beta
							</p>
							<p className="mt-1 text-xs font-medium text-app-muted-fg">
								{walletReadiness.readiness.reason}
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 text-xs">
						<BalanceItem
							label="Trading balance"
							value={`${formatNumber(Number(walletReadiness.collateralBalanceFormatted))} USDC.e`}
						/>
						<BalanceItem
							label="Selected outcome"
							value={`${formatNumber(Number(walletReadiness.outcomeBalanceFormatted))} shares`}
						/>
					</div>
				</div>

				<ConnectButton.Custom>
					{({ chain, mounted, openChainModal, openConnectModal }) => {
						const connected = mounted && isConnected && address && chain;

						if (!user) {
							return (
								<Button
									className="h-14 bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90"
									onClick={() => setAuthOpen(true)}
									type="button"
								>
									Sign in to trade
								</Button>
							);
						}

						if (!connected) {
							return (
								<Button
									className="h-14 bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90"
									onClick={openConnectModal}
									type="button"
								>
									<Wallet className="size-4" />
									Connect wallet
								</Button>
							);
						}

						if (chain.unsupported || chainId !== 137) {
							return (
								<Button
									className="h-14 bg-danger text-base font-bold text-white hover:bg-danger/90"
									onClick={openChainModal}
									type="button"
								>
									Switch to Polygon
								</Button>
							);
						}

						if (
							side === tradeSide.buy &&
							requiredCollateral > 0 &&
							walletReadiness.hasCollateral &&
							!walletReadiness.hasAllowance
						) {
							return (
								<Button
									className="h-14 bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90"
									disabled={walletReadiness.approvalPending}
									onClick={() =>
										walletReadiness
											.approveUsdc()
											.then(() => toast.success("USDC.e approval submitted"))
											.catch((error) =>
												toast.error(
													getRequestErrorMessage(error, "Approval failed"),
												),
											)
									}
									type="button"
								>
									{walletReadiness.approvalPending
										? "Confirming approval..."
										: "Approve USDC.e"}
								</Button>
							);
						}

						if (
							side === tradeSide.sell &&
							requiredShares > 0 &&
							walletReadiness.hasShares &&
							!walletReadiness.hasOutcomeApproval
						) {
							return (
								<Button
									className="h-14 bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90"
									disabled={walletReadiness.approvalPending}
									onClick={() =>
										walletReadiness
											.approveOutcome()
											.then(() => toast.success("Outcome approval submitted"))
											.catch((error) =>
												toast.error(
													getRequestErrorMessage(error, "Approval failed"),
												),
											)
									}
									type="button"
								>
									{walletReadiness.approvalPending
										? "Confirming approval..."
										: "Approve outcome shares"}
								</Button>
							);
						}

						return (
							<Button
								className="h-14 bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
								disabled={
									marketResolved ||
									submitPending ||
									!walletReadiness.readiness.ready
								}
								onClick={handleTrade}
								type="button"
							>
								{marketResolved
									? "Market resolved"
									: submitPending
										? "Submitting..."
										: walletReadiness.readiness.ready
										? `${side === tradeSide.buy ? "Buy" : "Sell"} ${selectedOutcome?.label ?? "Shares"}`
										: "Wallet not ready"}
							</Button>
						);
					}}
				</ConnectButton.Custom>

				<p className="text-center text-xs font-medium text-app-muted-fg">
					By trading, you agree to the Terms of Use.
				</p>
			</div>

			<CustomModal
				className="border-app-border bg-app-card p-0 text-app-fg"
				onOpenChange={setAuthOpen}
				open={authOpen}
				showHeader={false}
				title="Sign in to trade"
			>
				<AuthPanel />
			</CustomModal>
		</aside>
	);
}

function getSignedOrderAmount({
	amount,
	limitBuyShares,
	orderType,
	side,
}: {
	amount: number;
	limitBuyShares: number;
	orderType: TradeOrderType;
	side: TradeSide;
}) {
	if (orderType === tradeOrderType.limit && side === tradeSide.buy) {
		return limitBuyShares;
	}

	return amount;
}

function getOutcomePrice(
	outcomeTokenId: string,
	selectedTokenId: string | undefined,
	orderBook: PolymarketOrderBook | null | undefined,
	side: TradeSide,
) {
	if (outcomeTokenId !== selectedTokenId) {
		return null;
	}

	return side === tradeSide.buy ? orderBook?.best_ask : orderBook?.best_bid;
}

function TabButton({
	active,
	children,
	onClick,
}: {
	active: boolean;
	children: string;
	onClick: () => void;
}) {
	return (
		<button
			className={cn(
				"border-b-2 pb-4",
				active
					? "border-app-fg text-app-fg"
					: "border-transparent text-app-muted-fg",
			)}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}

function BalanceItem({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-app-muted-fg">{label}</p>
			<p className="mt-1 font-bold text-app-fg">{value}</p>
		</div>
	);
}

function SummaryRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<span className="text-app-muted-fg">{label}</span>
			<span className="text-app-fg">{value}</span>
		</div>
	);
}

function MarketImage({
	image,
	title,
}: {
	image?: string | null;
	title: string;
}) {
	if (image) {
		return <img alt="" className="size-16 shrink-0 object-cover" src={image} />;
	}

	return (
		<div className="grid size-16 shrink-0 place-items-center bg-app-muted text-2xl font-black text-app-fg">
			{title.charAt(0).toUpperCase()}
		</div>
	);
}

function formatPrice(value: number | null | undefined) {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return "—";
	}

	return `${(value * 100).toFixed(value < 0.01 ? 2 : 1)}¢`;
}

function formatNumber(value: number) {
	if (!Number.isFinite(value) || value < 0) {
		return "—";
	}

	return new Intl.NumberFormat("en-US", {
		maximumFractionDigits: 2,
	}).format(value);
}
