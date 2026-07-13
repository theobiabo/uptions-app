import { NoDataFound } from "@/components/misc/no-data-found.tsx";
import { Typography } from "@/components/typography/typography.tsx";
import { useAutomationAlerts } from "@/hooks/use-automations.ts";
import type { AutomationAlert } from "@/packages/types/automation.types.ts";
import { formatDate } from "@/util/formatters.ts";

export function AlertsSection() {
	const { alerts, error, isLoading } = useAutomationAlerts();

	return (
		<aside className="min-w-0">
			<Typography className="mb-8 text-[var(--app-fg)]" variant="h2">
				Recent Alerts
			</Typography>
			<div className="grid gap-5">
				{isLoading ? (
					<AlertLoadingCards />
				) : error ? (
					<div className="border border-danger/40 bg-danger/10 p-5">
						<Typography className="text-danger" variant="h3">
							Unable to load alerts
						</Typography>
						<Typography className="mt-2 text-app-muted-fg" variant="bodySm">
							{error}
						</Typography>
					</div>
				) : alerts.length > 0 ? (
					alerts.map((alert) => <AlertCard alert={alert} key={alert.id} />)
				) : (
					<NoDataFound
						description="Alerts will appear here when your automations start running."
						title="No alerts found"
					/>
				)}
			</div>
		</aside>
	);
}

function AlertCard({ alert }: { alert: AutomationAlert }) {
	return (
		<article className="border border-app-border bg-app-card p-5 text-app-fg shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<h3 className="text-sm font-semibold">{alert.title}</h3>
					<p className="mt-2 text-sm leading-6 text-app-muted-fg">
						{alert.message}
					</p>
				</div>
				<span className="rounded-full bg-app-muted px-3 py-1 text-xs font-semibold capitalize text-primary">
					{alert.status}
				</span>
			</div>
			<p className="mt-4 text-xs font-medium text-app-muted-fg">
				{formatDate(alert.created_at)}
			</p>
		</article>
	);
}

function AlertLoadingCards() {
	return ["alert-loading-1", "alert-loading-2", "alert-loading-3"].map(
		(key) => (
			<div
				className="h-34 animate-pulse border border-app-border bg-app-muted"
				key={key}
			/>
		),
	);
}
