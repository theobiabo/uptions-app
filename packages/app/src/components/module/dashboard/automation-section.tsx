import { Plus } from "lucide-react";

import { NoDataFound } from "@/components/misc/no-data-found.tsx";
import { Typography } from "@/components/typography/typography.tsx";

export function AutomationSection() {
	return (
		<section className="min-w-0">
			<Typography className="mb-8 text-[var(--app-fg)]" variant="h2">
				Active Automations
			</Typography>
			<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
				<NoDataFound
					action={<NewAutomationLink />}
					className="sm:col-span-2 xl:col-span-3"
					description="Create your first automation from the builder."
					title="No automations found"
				/>
			</div>
		</section>
	);
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
