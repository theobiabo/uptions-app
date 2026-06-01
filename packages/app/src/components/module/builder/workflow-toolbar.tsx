import { ChevronDown, Play, Redo2, Undo2, Wallet, X } from "lucide-react";

import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { VenueId } from "@/packages/venues/venue-data.ts";
import { venues } from "@/packages/venues/venue-data.ts";

type WorkflowToolbarProps = {
	onVenueChange: (venue: VenueId) => void;
	venue: VenueId;
};

export function WorkflowToolbar({
	onVenueChange,
	venue,
}: WorkflowToolbarProps) {
	return (
		<header className="flex h-[68px] shrink-0 items-center justify-between gap-4 border-b border-[var(--app-border)] bg-builder-panel px-5">
			<div className="min-w-0">
				<Typography className="text-[var(--app-fg)]" variant="h3">
					Untitled Workflow
				</Typography>
				<label className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--app-muted-fg)]">
					Market
					<select
						className="bg-transparent text-xs normal-case tracking-normal text-[var(--app-fg)] outline-none"
						onChange={(event) => onVenueChange(event.target.value as VenueId)}
						value={venue}
					>
						{venues.map((item) => (
							<option key={item.id} value={item.id}>
								{item.label}
							</option>
						))}
					</select>
				</label>
			</div>

			<div className="flex items-center gap-6">
				<div className="hidden items-center gap-4 text-[var(--app-muted-fg)] sm:flex">
					<Button
						aria-label="Undo"
						className="size-8 border-0 bg-transparent text-[var(--app-muted-fg)] hover:bg-[var(--app-muted)] hover:text-[var(--app-fg)]"
						size="icon"
						type="button"
						variant="ghost"
					>
						<Undo2 className="size-4" />
					</Button>
					<Button
						aria-label="Redo"
						className="size-8 border-0 bg-transparent text-[var(--app-muted-fg)] hover:bg-[var(--app-muted)] hover:text-[var(--app-fg)]"
						size="icon"
						type="button"
						variant="ghost"
					>
						<Redo2 className="size-4" />
					</Button>
				</div>

				<Button
					className="hidden h-9 gap-2 border-0 bg-transparent px-2 text-sm font-medium text-[var(--app-fg)] hover:bg-[var(--app-muted)] md:inline-flex"
					type="button"
					variant="ghost"
				>
					105%
					<ChevronDown className="size-4" />
				</Button>

				<Button
					className="h-9 border-0 bg-transparent px-2 text-sm font-medium text-[var(--app-fg)] hover:bg-[var(--app-muted)]"
					type="button"
					variant="ghost"
				>
					<Play className="size-4" />
					Test Run
				</Button>

				<Button className="h-10 bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
					<Wallet className="size-4 md:hidden" />
					<span className="hidden md:inline">Publish</span>
				</Button>

				<a
					aria-label="Close builder"
					className="hidden text-[var(--app-muted-fg)] no-underline hover:text-[var(--app-fg)] sm:block"
					href="/dashboard"
				>
					<X className="size-5" />
				</a>
			</div>
		</header>
	);
}
