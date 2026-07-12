import {
	type ApiKeyCreds,
	Chain,
	ClobClient,
	OrderType,
	Side,
	SignatureType,
	type SignedOrder,
} from "@polymarket/clob-client";
import type { WalletClient } from "viem";
import type {
	PolymarketExecutionType,
	TradeOrderType,
	TradeSide,
} from "@/packages/types/trade.types.ts";

const polymarketClobHost =
	import.meta.env.VITE_POLYMARKET_CLOB_HOST ?? "https://clob.polymarket.com";

export type PolymarketOrderSigningInput = {
	amount: number;
	executionType: PolymarketExecutionType;
	feeRateBps: number;
	negativeRisk: boolean;
	orderType: TradeOrderType;
	price?: number | null;
	side: TradeSide;
	tickSize: string;
	tokenId: string;
};

export function createPolymarketClient(
	walletClient: WalletClient,
	creds?: ApiKeyCreds,
) {
	const account = walletClient.account?.address;

	if (!account) {
		throw new Error("Wallet account is unavailable");
	}

	return new ClobClient(
		polymarketClobHost,
		Chain.POLYGON,
		walletClient,
		creds,
		SignatureType.EOA,
		account,
	);
}

export async function createOrDerivePolymarketCredentials(
	walletClient: WalletClient,
) {
	const client = createPolymarketClient(walletClient);
	return client.createOrDeriveApiKey();
}

export async function createSignedPolymarketOrder(
	walletClient: WalletClient,
	creds: ApiKeyCreds,
	input: PolymarketOrderSigningInput,
): Promise<SignedOrder> {
	const client = createPolymarketClient(walletClient, creds);
	const side = toPolymarketSide(input.side);
	const options = {
		negRisk: input.negativeRisk,
		tickSize: input.tickSize,
	};

	if (input.orderType === "MARKET") {
		return client.createMarketOrder(
			{
				amount: input.amount,
				feeRateBps: input.feeRateBps,
				orderType: toPolymarketExecutionType(input.executionType),
				price: input.price ?? undefined,
				side,
				tokenID: input.tokenId,
			},
			options,
		);
	}

	const price = input.price;

	if (!price) {
		throw new Error("Limit price is required");
	}

	return client.createOrder(
		{
			feeRateBps: input.feeRateBps,
			price,
			side,
			size: input.amount,
			tokenID: input.tokenId,
		},
		options,
	);
}

export function toPolymarketExecutionType(value: PolymarketExecutionType) {
	switch (value) {
		case "FAK":
			return OrderType.FAK;
		case "GTC":
			return OrderType.GTC;
		case "GTD":
			return OrderType.GTD;
		default:
			return OrderType.FOK;
	}
}

function toPolymarketSide(value: TradeSide) {
	return value === "BUY" ? Side.BUY : Side.SELL;
}
