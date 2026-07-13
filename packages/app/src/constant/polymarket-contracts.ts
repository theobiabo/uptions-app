import { type Address, parseAbi } from "viem";

export const POLYGON_CHAIN_ID = 137;
export const POLYGON_USDC_E_DECIMALS = 6;

export const POLYMARKET_CONTRACTS = {
	conditionalTokens: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045",
	ctfExchange: "0x4bFb41d5B3570Defd03C39a9A4D8dE6bd8B8982E",
	negRiskExchange: "0xC5d563A36AE78145C45a50134d48A1215220f80a",
	usdcE: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
} as const satisfies Record<string, Address>;

export const erc20TradingAbi = parseAbi([
	"function allowance(address owner, address spender) view returns (uint256)",
	"function approve(address spender, uint256 amount) returns (bool)",
	"function balanceOf(address account) view returns (uint256)",
]);

export const erc1155TradingAbi = parseAbi([
	"function balanceOf(address account, uint256 id) view returns (uint256)",
	"function isApprovedForAll(address account, address operator) view returns (bool)",
	"function setApprovalForAll(address operator, bool approved)",
]);

export function getPolymarketExchange(negativeRisk: boolean): Address {
	return negativeRisk
		? POLYMARKET_CONTRACTS.negRiskExchange
		: POLYMARKET_CONTRACTS.ctfExchange;
}
