import type { VenueId } from "@/packages/venues/venue-data.ts";

export type EmailAuthRequest = {
	email: string;
	password: string;
};

export type ForgotPasswordRequest = {
	email: string;
};

export type ResetPasswordRequest = {
	token: string;
	password: string;
};

export type VerifyEmailRequest = {
	token: string;
};

export const tradingProvider = {
	polymarket: "POLYMARKET",
} as const;

export const supportedChain = {
	polygon: "POLYGON",
} as const;

export type TradingProvider =
	(typeof tradingProvider)[keyof typeof tradingProvider];

export type SupportedChain =
	(typeof supportedChain)[keyof typeof supportedChain];

export type TradingProviderOption = {
	available: boolean;
	chain: SupportedChain;
	chain_id: number;
	chain_label: string;
	description: string;
	image_key: string;
	label: string;
	provider: TradingProvider;
	venue_id: VenueId;
};

export type UpdateTradingProviderRequest = {
	provider: TradingProvider;
};

export type UserTradingProviderResponse = {
	preferred_trading_provider: TradingProvider;
};

export type UpdateWalletRequest = {
	chain: SupportedChain;
	chain_id: number;
	provider: TradingProvider;
	wallet_address: string;
};

export type UserWalletResponse = UpdateWalletRequest;

export type VenueConnection = {
	id: string;
	venue: VenueId;
	auth_type: string;
	account_identifier: string;
	enabled: boolean;
	limits: Record<string, unknown>;
	permissions: Record<string, unknown>;
	status: string;
};

export type AuthUser = {
	id: string;
	primary_wallet_address: string | null;
	wallet_address: string | null;
	email: string | null;
	email_verified: boolean;
	preferred_trading_provider: TradingProvider | null;
	venue_connections: VenueConnection[];
};

export type AuthSessionResponse = {
	access_token: string;
	token_type: "Bearer";
	expires_at: number;
	user: AuthUser;
};

export type ConnectPolymarketRequest = {
	account_identifier?: string;
	api_key: string;
	secret: string;
	passphrase: string;
	funder?: string;
	signature_type?: number;
	limits?: Record<string, unknown>;
	permissions?: Record<string, unknown>;
};
