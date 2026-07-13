import {
	Activity,
	Bot,
	CircleDot,
	LineChart,
	RefreshCw,
	ShieldAlert,
	Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAnalyticsOverview } from "@/hooks/use-analytics.ts";
import { cn } from "@/lib/utils.ts";
import type {
	AnalyticsDailyActivity,
	AnalyticsOverview,
	AnalyticsStatusCount,
} from "@/packages/types/analytics.types.ts";

export function AnalyticsPage() {
	const { error, isLoading, overview, refetch } = useAnalyticsOverview();

	return (
		<DashboardLayout>
			<div className="grid gap-5 px-5 py-5 sm:px-8">
				{isLoading ? <AnalyticsLoading /> : null}
				{!isLoading && error ? (
					<Panel className="grid min-h-56 place-items-center text-center">
						<div className="max-w-md">
							<ShieldAlert className="mx-auto size-8 text-danger" />
							<Typography className="mt-4 text-app-fg" variant="h3">
								Analytics unavailable
							</Typography>
							<Typography className="mt-2 text-app-muted-fg" variant="bodySm">
								{error}
							</Typography>
							<Button className="mt-5" onClick={() => refetch()} type="button">
								<RefreshCw className="size-4" /> Retry
							</Button>
						</div>
					</Panel>
				) : null}
				{!isLoading && !error && overview ? (
					<AnalyticsContent overview={overview} />
				) : null}
			</div>
		</DashboardLayout>
	);
}

function AnalyticsContent({ overview }: { overview: AnalyticsOverview }) {
	return (
		<>
			<MetricGrid overview={overview} />
			<TradeStatuses statuses={overview.trade_status_summary} />
			<FinancialPerformance overview={overview} />
			<div className="grid gap-5 xl:grid-cols-2">
				<WorkflowActivity overview={overview} />
				<DailyActivity activity={overview.daily_activity} />
			</div>
		</>
	);
}

function Panel({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn(
				"border border-app-border bg-app-card p-4 sm:p-5",
				className,
			)}
		>
			{children}
		</section>
	);
}

function MetricGrid({ overview }: { overview: AnalyticsOverview }) {
	const { counts } = overview;
	const automationRate =
		counts.automations > 0 ? counts.active_automations / counts.automations : 0;
	const metrics = [
		{
			detail: "Total submitted trade intentions",
			icon: Activity,
			label: "Trade Intents",
			tone: "text-violet",
			value: counts.trade_intents.toLocaleString(),
		},
		{
			detail: `${counts.active_automations.toLocaleString()} currently active`,
			icon: Bot,
			label: "Automations",
			tone: "text-info",
			value: counts.automations.toLocaleString(),
		},
		{
			detail: `${formatPercent(automationRate)} of automations active`,
			icon: Zap,
			label: "Active Automations",
			tone: "text-warning",
			value: counts.active_automations.toLocaleString(),
		},
		{
			detail: "Total workflow executions",
			icon: CircleDot,
			label: "Automation Runs",
			tone: "text-success",
			value: counts.automation_runs.toLocaleString(),
		},
	];

	return (
		<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
			{metrics.map((metric) => {
				const Icon = metric.icon;
				return (
					<Panel className="min-h-32" key={metric.label}>
						<div className="flex items-start justify-between gap-4">
							<div className="min-w-0">
								<Typography className="text-app-muted-fg" variant="bodySm">
									{metric.label}
								</Typography>
								<Typography className="mt-3 text-app-fg" variant="h2">
									{metric.value}
								</Typography>
								<Typography
									className={cn("mt-1 break-words", metric.tone)}
									variant="bodySm"
								>
									{metric.detail}
								</Typography>
							</div>
							<Icon className={cn("size-4 shrink-0", metric.tone)} />
						</div>
					</Panel>
				);
			})}
		</div>
	);
}

function TradeStatuses({ statuses }: { statuses: AnalyticsStatusCount[] }) {
	const entries = consolidateStatuses(statuses);
	const total = entries.reduce((sum, item) => sum + item.count, 0);
	return (
		<Panel>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<Typography className="text-app-fg" variant="h3">
					Trade Status
				</Typography>
				<Typography className="text-app-muted-fg" variant="bodySm">
					{total.toLocaleString()} tracked
				</Typography>
			</div>
			{entries.length === 0 ? (
				<div className="mt-5">
					<EmptyState text="No trade status activity yet." />
				</div>
			) : (
				<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
					{entries.map((item) => (
						<div
							className="border border-app-border bg-app-muted p-4"
							key={item.status}
						>
							<div className="flex items-center justify-between gap-3">
								<StatusBadge status={item.status} />
								<Typography className="text-app-fg" variant="h3">
									{item.count.toLocaleString()}
								</Typography>
							</div>
							<div className="mt-3 h-1.5 overflow-hidden bg-app-card">
								<div
									className={cn("h-full", statusBarTone(item.status))}
									style={{
										width: `${total > 0 ? (item.count / total) * 100 : 0}%`,
									}}
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</Panel>
	);
}

function FinancialPerformance({ overview }: { overview: AnalyticsOverview }) {
	const { performance, pnl } = overview;
	const pnlItems = [
		{ label: "Total PnL", value: pnl.total_pnl },
		{ label: "Realized PnL", value: pnl.realized_pnl },
		{ label: "Unrealized PnL", value: pnl.unrealized_pnl },
	];
	const performanceItems = [
		{ label: "Win Rate", value: formatOptionalPercent(performance.win_rate) },
		{
			label: "Return",
			value: formatOptionalPercent(performance.return_percentage),
		},
	];

	return (
		<div className="grid gap-5 xl:grid-cols-2">
			<Panel className="min-h-56">
				<AvailabilityHeader
					available={pnl.available}
					icon={<LineChart className="size-5" />}
					reason={pnl.reason}
					title="PnL"
				/>
				<div className="mt-6 grid gap-3 sm:grid-cols-3">
					{pnlItems.map((item) => (
						<ValueCard
							key={item.label}
							label={item.label}
							unavailable={!pnl.available || item.value === null}
							value={
								item.value === null ? "Unavailable" : formatCurrency(item.value)
							}
						/>
					))}
				</div>
			</Panel>
			<Panel className="min-h-56">
				<AvailabilityHeader
					available={performance.available}
					icon={<Activity className="size-5" />}
					reason={performance.reason}
					title="Performance"
				/>
				<div className="mt-6 grid gap-3 sm:grid-cols-2">
					{performanceItems.map((item) => (
						<ValueCard
							key={item.label}
							label={item.label}
							unavailable={!performance.available || item.value === null}
							value={item.value ?? "Unavailable"}
						/>
					))}
				</div>
			</Panel>
		</div>
	);
}

function AvailabilityHeader({
	available,
	icon,
	reason,
	title,
}: {
	available: boolean;
	icon: ReactNode;
	reason: string;
	title: string;
}) {
	return (
		<div className="flex items-start gap-3">
			<span className={available ? "text-success" : "text-app-muted-fg"}>
				{icon}
			</span>
			<div>
				<div className="flex flex-wrap items-center gap-2">
					<Typography className="text-app-fg" variant="h3">
						{title}
					</Typography>
					<span
						className={cn(
							"border px-2 py-0.5 text-xs",
							available
								? "border-success/30 bg-success/10 text-success"
								: "border-app-border text-app-muted-fg",
						)}
					>
						{available ? "Available" : "Unavailable"}
					</span>
				</div>
				<Typography className="mt-1 text-app-muted-fg" variant="bodySm">
					{reason}
				</Typography>
			</div>
		</div>
	);
}

function ValueCard({
	label,
	unavailable,
	value,
}: {
	label: string;
	unavailable: boolean;
	value: string;
}) {
	return (
		<div
			className={cn(
				"border bg-app-muted p-4",
				unavailable ? "border-dashed border-app-border" : "border-app-border",
			)}
		>
			<Typography className="text-app-muted-fg" variant="bodySm">
				{label}
			</Typography>
			<Typography
				className={cn(
					"mt-2",
					unavailable ? "text-app-muted-fg" : "text-app-fg",
				)}
				variant="h3"
			>
				{value}
			</Typography>
		</div>
	);
}

function WorkflowActivity({ overview }: { overview: AnalyticsOverview }) {
	return (
		<Panel className="min-h-96">
			<div className="flex items-center justify-between gap-4">
				<Typography className="text-app-fg" variant="h3">
					Workflow Activity
				</Typography>
				<Typography className="text-app-muted-fg" variant="bodySm">
					{overview.workflow_activity.length} workflows
				</Typography>
			</div>
			<div className="mt-6 grid gap-2">
				{overview.workflow_activity.length === 0 ? (
					<EmptyState text="No workflow activity yet." />
				) : (
					overview.workflow_activity.map((item) => (
						<div
							className="border border-app-border bg-app-muted px-3 py-3"
							key={item.automation_id}
						>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2">
										<Typography
											className="truncate text-app-fg"
											variant="label"
										>
											{item.title}
										</Typography>
										<StatusBadge status={item.automation_status} />
										{item.last_run_status ? (
											<StatusBadge status={item.last_run_status} />
										) : null}
									</div>
									<Typography
										className="mt-2 text-app-muted-fg"
										variant="bodySm"
									>
										Last run: {formatDateTime(item.last_run_at)}
									</Typography>
								</div>
								<Typography className="shrink-0 text-app-fg" variant="label">
									{item.total_runs.toLocaleString()} runs
								</Typography>
							</div>
							{item.run_status_summary.length > 0 ? (
								<div className="mt-3 flex flex-wrap gap-2">
									{consolidateStatuses(item.run_status_summary).map(
										(status) => (
											<span
												className="text-xs text-app-muted-fg"
												key={status.status}
											>
												{formatStatus(status.status)}:{" "}
												{status.count.toLocaleString()}
											</span>
										),
									)}
								</div>
							) : null}
						</div>
					))
				)}
			</div>
		</Panel>
	);
}

function DailyActivity({ activity }: { activity: AnalyticsDailyActivity[] }) {
	const maximum = Math.max(
		1,
		...activity.map((item) => item.trade_intents + item.automation_runs),
	);
	return (
		<Panel className="min-h-96">
			<Typography className="text-app-fg" variant="h3">
				Daily Activity
			</Typography>
			{activity.length === 0 ? (
				<div className="mt-6">
					<EmptyState text="No daily activity yet." />
				</div>
			) : (
				<>
					<div className="mt-8 flex h-56 items-end gap-2 overflow-x-auto border-b border-app-border px-2 sm:gap-4">
						{activity.map((item) => {
							const total = item.trade_intents + item.automation_runs;
							return (
								<div
									className="flex h-full min-w-10 flex-1 flex-col items-center justify-end"
									key={item.date}
									title={`${item.trade_intents} trade intents · ${item.automation_runs} automation runs`}
								>
									<div
										className="flex w-full max-w-12 flex-col-reverse"
										style={{ height: `${(total / maximum) * 85}%` }}
									>
										<div
											className="bg-violet"
											style={{ flex: item.trade_intents }}
										/>
										<div
											className="bg-info"
											style={{ flex: item.automation_runs }}
										/>
									</div>
									<span className="mt-2 text-xs text-app-muted-fg">
										{formatDay(item.date)}
									</span>
								</div>
							);
						})}
					</div>
					<div className="mt-5 flex justify-center gap-5 text-sm text-app-muted-fg">
						<Legend label="Trade intents" tone="bg-violet" />
						<Legend label="Automation runs" tone="bg-info" />
					</div>
				</>
			)}
		</Panel>
	);
}

function AnalyticsLoading() {
	return (
		<>
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				{[0, 1, 2, 3].map((item) => (
					<div
						className="h-32 animate-pulse border border-app-border bg-app-card"
						key={item}
					/>
				))}
			</div>
			<div className="h-52 animate-pulse border border-app-border bg-app-card" />
			<div className="grid gap-5 xl:grid-cols-2">
				<div className="h-56 animate-pulse border border-app-border bg-app-card" />
				<div className="h-56 animate-pulse border border-app-border bg-app-card" />
			</div>
		</>
	);
}

function EmptyState({ text }: { text: string }) {
	return (
		<div className="grid min-h-40 place-items-center border border-dashed border-app-border bg-app-muted p-5 text-center">
			<Typography className="text-app-muted-fg" variant="bodySm">
				{text}
			</Typography>
		</div>
	);
}

function StatusBadge({ status }: { status: string }) {
	const tone = statusTone(status);
	return (
		<span className={cn("border px-2 py-0.5 text-xs capitalize", tone)}>
			{formatStatus(status)}
		</span>
	);
}

function Legend({ label, tone }: { label: string; tone: string }) {
	return (
		<span className="flex items-center gap-2">
			<span className={cn("size-3", tone)} />
			{label}
		</span>
	);
}

function consolidateStatuses(statuses: AnalyticsStatusCount[]) {
	const counts = new Map<string, number>();
	for (const item of statuses) {
		const status = item.status.trim().toLowerCase() || "unknown";
		const count =
			Number.isFinite(item.count) && item.count > 0 ? item.count : 0;
		counts.set(status, (counts.get(status) ?? 0) + count);
	}
	return [...counts.entries()]
		.map(([status, count]) => ({ count, status }))
		.sort((left, right) => right.count - left.count);
}

function statusTone(status: string) {
	const normalized = status.toLowerCase();
	if (
		["active", "completed", "filled", "success", "succeeded"].includes(
			normalized,
		)
	)
		return "border-success/30 bg-success/10 text-success";
	if (
		["failed", "error", "rejected", "cancelled", "canceled"].includes(
			normalized,
		)
	)
		return "border-danger/30 bg-danger/10 text-danger";
	if (["pending", "running", "submitted", "processing"].includes(normalized))
		return "border-info/30 bg-info/10 text-info";
	return "border-app-border text-app-muted-fg";
}

function statusBarTone(status: string) {
	const tone = statusTone(status);
	if (tone.includes("success")) return "bg-success";
	if (tone.includes("danger")) return "bg-danger";
	if (tone.includes("info")) return "bg-info";
	return "bg-app-muted-fg";
}

function formatStatus(status: string) {
	return status.replaceAll("_", " ").replaceAll("-", " ");
}

function formatPercent(value: number) {
	return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value * 100)}%`;
}

function formatOptionalPercent(value: number | null) {
	if (value === null) return null;
	const percent = Math.abs(value) <= 1 ? value * 100 : value;
	return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, signDisplay: "exceptZero" }).format(percent)}%`;
}

function formatCurrency(value: number) {
	return new Intl.NumberFormat(undefined, {
		currency: "USD",
		currencyDisplay: "narrowSymbol",
		maximumFractionDigits: 2,
		signDisplay: "exceptZero",
		style: "currency",
	}).format(value);
}

function formatDateTime(value: string | null) {
	if (!value) return "No runs yet";
	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? value
		: new Intl.DateTimeFormat(undefined, {
				dateStyle: "medium",
				timeStyle: "short",
			}).format(date);
}

function formatDay(value: string) {
	const date = new Date(`${value}T00:00:00`);
	return Number.isNaN(date.getTime())
		? value
		: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date);
}
