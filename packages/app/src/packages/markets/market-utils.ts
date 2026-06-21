import type { marketCategories } from "@/packages/markets/markets-data.ts";
import type { PolymarketMarket } from "@/packages/types/market.types.ts";

export type Market = {
	category: (typeof marketCategories)[number];
	change: string;
	description: string | null;
	id: string;
	image: string | null;
	no: string;
	platformUrl: string | null;
	positive: boolean;
	raw: PolymarketMarket;
	slug: string | null;
	title: string;
	volume: string;
	yes: string;
};

export function normalizeMarket(market: PolymarketMarket): Market {
	const [yesPrice, noPrice] = parsePricePair(market.outcomePrices);
	const change = market.oneDayPriceChange ?? market.oneWeekPriceChange ?? 0;
	const slug = market.slug ?? null;

	return {
		category: getMarketCategory(market),
		change: formatChange(change),
		description: market.description ?? null,
		id: market.id,
		image: market.image ?? market.icon ?? null,
		no: formatPrice(noPrice ?? getNoPrice(market)),
		platformUrl: slug ? `https://polymarket.com/event/${slug}` : null,
		positive: change >= 0,
		raw: market,
		slug,
		title: market.question ?? market.title ?? "Untitled market",
		volume: formatCompactCurrency(market.volumeNum ?? market.volume),
		yes: formatPrice(yesPrice ?? market.lastTradePrice ?? market.bestBid),
	};
}

export function parseStringArray(value: string | string[] | undefined) {
	if (Array.isArray(value)) {
		return value;
	}

	if (!value) {
		return [];
	}

	try {
		const parsed = JSON.parse(value);

		return Array.isArray(parsed) ? parsed.map(String) : [];
	} catch {
		return [];
	}
}

export function formatCompactCurrency(value: number | string | undefined) {
	const numberValue =
		typeof value === "string" ? Number.parseFloat(value) : value;

	if (typeof numberValue !== "number" || !Number.isFinite(numberValue)) {
		return "$0";
	}

	return new Intl.NumberFormat("en-US", {
		compactDisplay: "short",
		currency: "USD",
		maximumFractionDigits: 1,
		notation: "compact",
		style: "currency",
	}).format(numberValue);
}

function parsePricePair(value: PolymarketMarket["outcomePrices"]) {
	const prices = parseStringArray(value).map((price) => Number(price));

	return [
		Number.isFinite(prices[0]) ? prices[0] : null,
		Number.isFinite(prices[1]) ? prices[1] : null,
	] as const;
}

function getNoPrice(market: PolymarketMarket) {
	if (typeof market.lastTradePrice === "number") {
		return 1 - market.lastTradePrice;
	}

	if (typeof market.bestAsk === "number") {
		return 1 - market.bestAsk;
	}

	return undefined;
}

function getMarketCategory(
	market: PolymarketMarket,
): (typeof marketCategories)[number] {
	const feeType = market.feeType?.toLowerCase() ?? "";
	const text = `${market.question ?? ""} ${market.title ?? ""}`.toLowerCase();

	if (feeType.includes("crypto") || text.includes("bitcoin")) {
		return "Crypto";
	}

	if (
		feeType.includes("sports") ||
		text.includes("nba") ||
		text.includes("nhl")
	) {
		return "Sports";
	}

	if (
		text.includes("president") ||
		text.includes("trump") ||
		text.includes("election")
	) {
		return "Politics";
	}

	if (
		text.includes("fed") ||
		text.includes("rate") ||
		text.includes("inflation") ||
		text.includes("recession")
	) {
		return "Economics";
	}

	return "All";
}

function formatPrice(value: number | undefined) {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return "$0.00";
	}

	return `$${value.toFixed(value < 0.01 ? 3 : 2)}`;
}

function formatChange(value: number) {
	const percentage = value * 100;
	const sign = percentage >= 0 ? "+" : "";

	return `${sign}${percentage.toFixed(1)}%`;
}
