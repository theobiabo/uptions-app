const API_VERSION = "/api/v1";

const route = (path: string) => `${API_VERSION}${path}`;

export const API_ROUTES = {
	analytics: {
		overview: route("/analytics/overview"),
	},
	automations: {
		alert: (alertId: string) =>
			route(`/automation-alerts/${encodeURIComponent(alertId)}/read`),
		alerts: route("/automation-alerts"),
		alertsRead: route("/automation-alerts/read"),
		alertStream: route("/automation-alerts/stream"),
		item: (automationId: string) =>
			route(`/automations/${encodeURIComponent(automationId)}`),
		list: route("/automations"),
		publish: route("/automations"),
		status: (automationId: string) =>
			route(`/automations/${encodeURIComponent(automationId)}/status`),
		testRun: route("/automations/test-run"),
	},
	auth: {
		forgotPassword: route("/auth/forgot-password"),
		login: route("/auth/login"),
		logout: route("/auth/logout"),
		logoutAll: route("/auth/logout-all"),
		me: route("/auth/me"),
		resetPassword: route("/auth/reset-password"),
		signup: route("/auth/signup"),
		verifyEmail: route("/auth/verify-email"),
	},
	mcp: {
		approval: (approvalId: string) =>
			route(`/mcp/approvals/${encodeURIComponent(approvalId)}`),
		approvals: route("/mcp/approvals"),
		approve: (approvalId: string) =>
			route(`/mcp/approvals/${encodeURIComponent(approvalId)}/approve`),
		reject: (approvalId: string) =>
			route(`/mcp/approvals/${encodeURIComponent(approvalId)}/reject`),
	},
	markets: {
		comments: (marketId: string) =>
			route(`/markets/${encodeURIComponent(marketId)}/comments`),
		commentStream: (marketId: string) =>
			route(`/markets/${encodeURIComponent(marketId)}/comments/stream`),
		favorite: (marketId: string) =>
			route(`/markets/${encodeURIComponent(marketId)}/favorite`),
	},
	polymarket: {
		market: (marketId: string) =>
			route(`/polymarket/markets/${encodeURIComponent(marketId)}`),
		markets: route("/polymarket/markets"),
		orderBook: (tokenId: string) =>
			route(`/polymarket/order-books/${encodeURIComponent(tokenId)}`),
		venueChain: route("/polymarket/venue-chain"),
	},
	trades: {
		cancel: (tradeId: string) =>
			route(`/trades/${encodeURIComponent(tradeId)}/cancel`),
		item: (tradeId: string) => route(`/trades/${encodeURIComponent(tradeId)}`),
		list: route("/trades"),
		preflight: route("/trades/preflight"),
		reconcile: (tradeId: string) =>
			route(`/trades/${encodeURIComponent(tradeId)}/reconcile`),
		submit: (tradeId: string) =>
			route(`/trades/${encodeURIComponent(tradeId)}/submit`),
	},
	tradingProviders: route("/trading-providers"),
	users: {
		settings: {
			email: route("/users/settings/email"),
			password: route("/users/settings/password"),
			username: route("/users/settings/username"),
		},
		tradingProvider: route("/users/trading-provider"),
		wallet: route("/users/wallet"),
		walletChallenge: route("/users/wallet/challenge"),
		waitlist: route("/users/waitlist"),
	},
	venueConnections: {
		polymarket: route("/venue-connections/polymarket"),
	},
} as const;
