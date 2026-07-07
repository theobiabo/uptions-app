import type { marketCategories } from "@/packages/markets/markets-data.ts";
import type { PolymarketMarket } from "@/packages/types/market.types.ts";
import {
	formatCompactCurrency,
	formatPercentageChange,
	formatPrice,
} from "@/util/formatters.ts";
import { getNoPrice } from "@/util/market-calculations.ts";
import { parseStringArray } from "@/util/strings.ts";

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
		change: formatPercentageChange(change),
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

export { parseStringArray } from "@/util/strings.ts";

function parsePricePair(value: PolymarketMarket["outcomePrices"]) {
	const prices = parseStringArray(value).map((price) => Number(price));

	return [
		Number.isFinite(prices[0]) ? prices[0] : null,
		Number.isFinite(prices[1]) ? prices[1] : null,
	] as const;
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
