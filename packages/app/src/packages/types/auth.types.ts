import type { VenueId } from "@/packages/venues/venue-data.ts";

export type CreateChallengeRequest = {
	wallet_address: string;
};

export type CreateChallengeResponse = {
	wallet_address: string;
	nonce: string;
	message: string;
	expires_at: number;
};

export type VerifyChallengeRequest = {
	wallet_address: string;
	signature: string;
};

export type VenueConnection = {
	id: string;
	venue: VenueId;
	account_identifier: string;
	enabled: boolean;
	limits: Record<string, unknown>;
};

export type AuthUser = {
	id: string;
	primary_wallet_address: string;
	wallet_address: string;
	email: string | null;
	venue_connections: VenueConnection[];
};

export type VerifyChallengeResponse = {
	access_token: string;
	token_type: "Bearer";
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
};
