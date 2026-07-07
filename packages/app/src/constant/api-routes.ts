const API_VERSION = "/api/v1";

const route = (path: string) => `${API_VERSION}${path}`;

export const API_ROUTES = {
	automations: {
		alerts: route("/automation-alerts"),
		list: route("/automations"),
		publish: route("/automations"),
		testRun: route("/automations/test-run"),
	},
	auth: {
		forgotPassword: route("/auth/forgot-password"),
		login: route("/auth/login"),
		me: route("/auth/me"),
		resetPassword: route("/auth/reset-password"),
		signup: route("/auth/signup"),
		verifyEmail: route("/auth/verify-email"),
	},
	polymarket: {
		market: (marketId: string) =>
			route(`/polymarket/markets/${encodeURIComponent(marketId)}`),
		markets: route("/polymarket/markets"),
	},
	users: {
		waitlist: route("/users/waitlist"),
	},
	venueConnections: {
		polymarket: route("/venue-connections/polymarket"),
	},
} as const;
