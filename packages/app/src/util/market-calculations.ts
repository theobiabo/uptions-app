import type { PolymarketMarket } from "@/packages/types/market.types.ts";
import { getFiniteNumber } from "./numbers.ts";

export function getNoPrice(market: PolymarketMarket) {
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

export function getLeadingOutcome(
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
