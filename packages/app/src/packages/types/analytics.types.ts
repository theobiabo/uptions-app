export type AnalyticsStatusCount = {
	count: number;
	status: string;
};

export type AnalyticsCounts = {
	active_automations: number;
	automation_runs: number;
	automations: number;
	trade_intents: number;
};

export type AnalyticsDailyActivity = {
	automation_runs: number;
	date: string;
	trade_intents: number;
};

export type AnalyticsWorkflowActivity = {
	automation_id: string;
	automation_status: string;
	last_run_at: string | null;
	last_run_status: string | null;
	run_status_summary: AnalyticsStatusCount[];
	title: string;
	total_runs: number;
};

export type AnalyticsPnlAvailability = {
	available: boolean;
	realized_pnl: number | null;
	reason: string;
	total_pnl: number | null;
	unrealized_pnl: number | null;
};

export type AnalyticsPerformanceAvailability = {
	available: boolean;
	reason: string;
	return_percentage: number | null;
	win_rate: number | null;
};

export type AnalyticsOverview = {
	counts: AnalyticsCounts;
	daily_activity: AnalyticsDailyActivity[];
	performance: AnalyticsPerformanceAvailability;
	pnl: AnalyticsPnlAvailability;
	trade_status_summary: AnalyticsStatusCount[];
	workflow_activity: AnalyticsWorkflowActivity[];
};
