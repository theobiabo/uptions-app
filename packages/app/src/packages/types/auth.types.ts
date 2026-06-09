import type { VenueId } from "@/packages/venues/venue-data.ts";

export type EmailAuthRequest = {
	email: string;
	password: string;
};

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
