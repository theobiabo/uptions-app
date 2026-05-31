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
		<header className="flex h-[68px] shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-builder-panel px-5">
			<div className="min-w-0">
				<Typography className="text-white" variant="h3">
					Untitled Workflow
				</Typography>
				<label className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-white/45">
					Market
					<select
						className="bg-transparent text-xs normal-case tracking-normal text-white outline-none"
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
				<div className="hidden items-center gap-4 text-white/60 sm:flex">
					<Button
						aria-label="Undo"
						className="size-8  border-0 bg-transparent text-white/70 hover:bg-white/8 hover:text-white"
						size="icon"
						type="button"
						variant="ghost"
					>
						<Undo2 className="size-4" />
					</Button>
					<Button
						aria-label="Redo"
						className="size-8  border-0 bg-transparent text-white/40 hover:bg-white/8 hover:text-white"
						size="icon"
						type="button"
						variant="ghost"
					>
						<Redo2 className="size-4" />
					</Button>
				</div>

				<Button
					className="hidden h-9 gap-2  border-0 bg-transparent px-2 text-sm font-medium text-white hover:bg-white/8 md:inline-flex"
					type="button"
					variant="ghost"
				>
					105%
					<ChevronDown className="size-4" />
				</Button>

				<Button
					className="h-9  border-0 bg-transparent px-2 text-sm font-medium text-white hover:bg-white/8"
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
					className="hidden text-white/60 no-underline hover:text-white sm:block"
					href="/dashboard"
				>
					<X className="size-5" />
				</a>
			</div>
		</header>
	);
}
