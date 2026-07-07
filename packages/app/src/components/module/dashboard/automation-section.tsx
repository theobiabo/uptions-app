import { Plus } from "lucide-react";

import { NoDataFound } from "@/components/misc/no-data-found.tsx";
import { Typography } from "@/components/typography/typography.tsx";
import { useAutomations } from "@/hooks/use-automations.ts";
import type { Automation } from "@/packages/types/automation.types.ts";
import { formatDate } from "@/util/formatters.ts";

export function AutomationSection() {
	const { automations, isLoading } = useAutomations();

	return (
		<section className="min-w-0">
			<div className="mb-8 flex items-center justify-between gap-4">
				<Typography className="text-[var(--app-fg)]" variant="h2">
					Active Automations
				</Typography>
				<NewAutomationLink />
			</div>
			<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
				{isLoading ? (
					<AutomationLoadingCards />
				) : automations.length > 0 ? (
					automations.map((automation) => (
						<AutomationCard automation={automation} key={automation.id} />
					))
				) : (
					<NoDataFound
						action={<NewAutomationLink />}
						className="sm:col-span-2 xl:col-span-3"
						description="Create your first automation from the builder."
						title="No automations found"
					/>
				)}
			</div>
		</section>
	);
}

function AutomationCard({ automation }: { automation: Automation }) {
	const builderHref = automation.market_id
		? `/${automation.market_id}/builder`
		: "/builder";
	const marketLabel =
		automation.market_title ?? automation.market_id ?? "General workflow";

	return (
		<article className="border border-app-border bg-app-card p-5 text-app-fg shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<h3 className="truncate text-base font-semibold">
						{automation.title}
					</h3>
					<p className="mt-1 line-clamp-2 text-sm text-app-muted-fg">
						{marketLabel}
					</p>
				</div>
				<span className="rounded-full bg-app-muted px-3 py-1 text-xs font-semibold capitalize text-primary">
					{automation.status}
				</span>
			</div>
			<div className="mt-5 grid gap-3 text-sm text-app-muted-fg">
				<div className="flex items-center justify-between gap-4">
					<span>Venue</span>
					<span className="font-medium capitalize text-app-fg">
						{automation.venue}
					</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<span>Last run</span>
					<span className="font-medium text-app-fg">
						{automation.last_run_at
							? formatDate(automation.last_run_at)
							: "Not run yet"}
					</span>
				</div>
				<div className="flex items-center justify-between gap-4">
					<span>Run status</span>
					<span className="font-medium capitalize text-app-fg">
						{automation.last_run_status ?? "Pending"}
					</span>
				</div>
			</div>
			<a
				className="mt-5 inline-flex text-sm font-semibold text-primary no-underline hover:text-primary/80"
				href={builderHref}
			>
				Open Builder
			</a>
		</article>
	);
}

function AutomationLoadingCards() {
	return [
		"automation-loading-1",
		"automation-loading-2",
		"automation-loading-3",
	].map((key) => (
		<div
			className="h-55 animate-pulse border border-app-border bg-app-muted"
			key={key}
		/>
	));
}

function NewAutomationLink() {
	return (
		<a
			className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-semibold text-primary-foreground no-underline transition hover:bg-primary/90"
			href="/builder"
		>
			<Plus className="size-4" />
			New Automation
		</a>
	);
}
