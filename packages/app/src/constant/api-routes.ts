const API_VERSION = "/api/v1";

const route = (path: string) => `${API_VERSION}${path}`;

export const API_ROUTES = {
	auth: {
		login: route("/auth/login"),
		me: route("/auth/me"),
		signup: route("/auth/signup"),
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
