import { GripVertical, Search } from "lucide-react";

import { AppKeyword } from "@/common";
import { Typography } from "@/components/typography/typography.tsx";
import { cn } from "@/lib/utils.ts";
import type { WorkflowBlock } from "@/packages/builder/builder-data.ts";
import {
	workflowBlockGroups,
	workflowBlockTone,
} from "@/packages/builder/builder-data.ts";

export function BlockLibrary() {
	return (
		<aside className="relative z-10 flex min-h-0 w-full flex-col border-r border-[var(--app-border)] bg-builder-panel/90 backdrop-blur lg:w-[294px]">
			<div className="flex h-[68px] shrink-0 items-center border-b border-[var(--app-border)] px-4">
				<Typography className="text-[var(--app-fg)]" variant="h3">
					{AppKeyword.Blocks}
				</Typography>
			</div>
			<div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
				<label className="flex h-12 items-center gap-3 bg-[var(--app-muted)] px-4 text-[var(--app-muted-fg)]">
					<Search className="size-4" />
					<input
						className="min-w-0 flex-1 bg-transparent text-sm text-[var(--app-fg)] outline-none placeholder:text-[var(--app-muted-fg)]"
						placeholder={AppKeyword.Search}
						type="search"
					/>
				</label>

				<div className="mt-6 grid gap-6">
					{workflowBlockGroups.map((group) => (
						<section className="grid gap-3" key={group.kind}>
							<Typography
								className="text-[var(--app-muted-fg)]"
								variant="caption"
							>
								{group.title}
							</Typography>
							<div className="grid gap-3">
								{group.blocks.map((block) => (
									<BlockLibraryItem block={block} key={block.id} />
								))}
							</div>
						</section>
					))}
				</div>
			</div>
		</aside>
	);
}

function BlockLibraryItem({ block }: { block: WorkflowBlock }) {
	const tone = workflowBlockTone[block.kind];
	const Icon = block.icon;

	return (
		<button
			className={cn(
				"flex min-h-[54px] cursor-grab items-center gap-3 border px-3 py-3 text-left active:cursor-grabbing",
				tone.card,
			)}
			draggable
			onDragStart={(event) => {
				event.dataTransfer.setData("application/uptions-block", block.id);
				event.dataTransfer.effectAllowed = "move";
			}}
			type="button"
		>
			<GripVertical className="size-4 shrink-0 text-[var(--app-muted-fg)]" />
			<span
				className={cn("grid size-5 shrink-0 place-items-center ", tone.icon)}
			>
				<Icon className="size-3.5" />
			</span>
			<span className="min-w-0">
				<Typography className="truncate text-[var(--app-fg)]" variant="label">
					{block.title}
				</Typography>
				<Typography
					className="mt-1 truncate text-[var(--app-muted-fg)]"
					variant="caption"
				>
					{block.description}
				</Typography>
			</span>
		</button>
	);
}
