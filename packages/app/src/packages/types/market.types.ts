export type PolymarketMarket = {
	id: string;
	question?: string;
	title?: string;
	description?: string;
	image?: string;
	icon?: string;
	feeType?: string;
	active?: boolean;
	closed?: boolean;
	featured?: boolean;
	bestAsk?: number;
	bestBid?: number;
	lastTradePrice?: number;
	liquidity?: number | string;
	liquidityNum?: number;
	volume?: number | string;
	volumeNum?: number;
	volume24hr?: number;
	oneDayPriceChange?: number;
	oneHourPriceChange?: number;
	oneWeekPriceChange?: number;
	oneMonthPriceChange?: number;
	outcomes?: string | string[];
	outcomePrices?: string | string[];
	clobTokenIds?: string | string[];
	resolutionSource?: string;
	slug?: string;
	startDate?: string;
	endDate?: string;
};

export type PolymarketMarketsQuery = {
	active?: boolean;
	archived?: boolean;
	closed?: boolean;
	id?: string;
	limit?: number;
	offset?: number;
	slug?: string;
};

export type PolymarketOrderBookLevel = {
	depth_percent: number;
	price: number;
	shares: number;
	usd: number;
};

export type PolymarketOrderBook = {
	asks: PolymarketOrderBookLevel[];
	best_ask: number | null;
	best_bid: number | null;
	bids: PolymarketOrderBookLevel[];
	last_traded: number | null;
	spread: number | null;
	token_id: string;
	updated_at: string;
};
