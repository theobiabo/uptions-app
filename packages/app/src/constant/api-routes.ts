const API_VERSION = "/api/v1";

const route = (path: string) => `${API_VERSION}${path}`;

export const API_ROUTES = {
	auth: {
		forgotPassword: route("/auth/forgot-password"),
		login: route("/auth/login"),
		me: route("/auth/me"),
		resetPassword: route("/auth/reset-password"),
		signup: route("/auth/signup"),
		verifyEmail: route("/auth/verify-email"),
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
