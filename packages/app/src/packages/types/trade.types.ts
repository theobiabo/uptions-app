import type {
	SupportedChain,
	TradingProvider,
} from "@/packages/types/auth.types.ts";

export const tradeSide = {
	buy: "BUY",
	sell: "SELL",
} as const;

export const tradeOrderType = {
	limit: "LIMIT",
	market: "MARKET",
} as const;

export const polymarketExecutionType = {
	fak: "FAK",
	fok: "FOK",
	gtc: "GTC",
	gtd: "GTD",
} as const;

export type TradeSide = (typeof tradeSide)[keyof typeof tradeSide];
export type TradeOrderType =
	(typeof tradeOrderType)[keyof typeof tradeOrderType];
export type PolymarketExecutionType =
	(typeof polymarketExecutionType)[keyof typeof polymarketExecutionType];

export type CreateTradeIntentRequest = {
	amount: number;
	automation_id?: string;
	execution_type: PolymarketExecutionType;
	market_id: string;
	market_title: string;
	order_type: TradeOrderType;
	outcome: string;
	price?: number | null;
	provider: TradingProvider;
	side: TradeSide;
	token_id: string;
	wallet_address: string;
};

export type PolymarketTokenMetadata = {
	fee_rate_bps: number;
	negative_risk: boolean;
	tick_size: string;
	token_id: string;
};

export type TradeIntent = {
	amount: number;
	automation_id: string | null;
	chain: SupportedChain;
	chain_id: number;
	created_at: string;
	error: string | null;
	execution_type: PolymarketExecutionType;
	id: string;
	market_id: string;
	market_title: string;
	order_type: TradeOrderType;
	outcome: string;
	price: number | null;
	provider: TradingProvider;
	provider_order_id: string | null;
	provider_response: Record<string, unknown> | null;
	side: TradeSide;
	status: string;
	submitted_at: string | null;
	token_id: string;
	updated_at: string;
	wallet_address: string;
};

export type CreateTradeIntentResponse = {
	token_metadata: PolymarketTokenMetadata;
	trade: TradeIntent;
};

export type SubmitSignedTradeRequest = {
	defer_exec?: boolean;
	execution_type: PolymarketExecutionType;
	post_only?: boolean;
	signed_order: Record<string, unknown>;
};

export type SubmitSignedTradeResponse = {
	provider_response: Record<string, unknown>;
	trade: TradeIntent;
};
