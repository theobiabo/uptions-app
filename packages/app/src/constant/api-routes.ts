const API_VERSION = "/api/v1";

const route = (path: string) => `${API_VERSION}${path}`;

export const API_ROUTES = {
	auth: {
		challenge: route("/auth/challenge"),
		me: route("/auth/me"),
		verify: route("/auth/verify"),
	},
	polymarket: {
		markets: route("/polymarket/markets"),
	},
	users: {
		waitlist: route("/users/waitlist"),
	},
	venueConnections: {
		polymarket: route("/venue-connections/polymarket"),
	},
} as const;
