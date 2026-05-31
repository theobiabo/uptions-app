import { NoDataFound } from "@/components/misc/no-data-found.tsx";
import { Typography } from "@/components/typography/typography.tsx";

export function AlertsSection() {
	return (
		<aside className="min-w-0">
			<Typography className="mb-8 text-[var(--app-fg)]" variant="h2">
				Recent Alerts
			</Typography>
			<div className="grid gap-5">
				<NoDataFound
					description="Alerts will appear here when your automations start running."
					title="No alerts found"
				/>
			</div>
		</aside>
	);
}
