import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

import { Typography } from "@/components/typography/typography.tsx";
import { cn } from "@/lib/utils.ts";
import type { WorkflowBlock } from "@/packages/builder/builder-data.ts";
import {
	workflowBlockKind,
	workflowBlockTone,
} from "@/packages/builder/builder-data.ts";
import { getVenueConfig } from "@/packages/venues/venue-data.ts";

type WorkflowNodeData = WorkflowBlock;

export type WorkflowNodeProps = NodeProps & {
	data: WorkflowNodeData;
};

export function WorkflowNode({ data, selected }: WorkflowNodeProps) {
	const tone = workflowBlockTone[data.kind];
	const Icon = data.icon;
	const venue = getVenueConfig(data.venue);
	const hasTarget = data.kind !== workflowBlockKind.trigger;
	const hasSource = data.kind !== workflowBlockKind.action;

	return (
		<div
			className={cn(
				"min-h-[82px] w-[320px] overflow-hidden border bg-builder-panel/95",
				tone.card,
				selected && "ring-2 ring-info",
			)}
		>
			{hasTarget ? (
				<Handle
					className="!size-3 !border-2 !border-app-inverse !bg-dashboard-bg"
					position={Position.Left}
					type="target"
				/>
			) : null}
			<div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
				<span className={cn("grid size-5 place-items-center ", tone.icon)}>
					<Icon className="size-3.5" />
				</span>
				<div className="min-w-0">
					<Typography className="text-[10px] text-white/55" variant="caption">
						{tone.label} - {venue.label}
					</Typography>
					<Typography className="truncate text-white" variant="label">
						{data.title}
					</Typography>
				</div>
				{data.kind === workflowBlockKind.trigger ? (
					<span className="ml-auto size-1.5 bg-success" />
				) : null}
			</div>
			<Typography className="px-4 py-3 text-white/65" variant="caption">
				{data.value}
			</Typography>
			{hasSource ? (
				<Handle
					className="!size-3 !border-2 !border-app-inverse !bg-info"
					position={Position.Right}
					type="source"
				/>
			) : null}
		</div>
	);
}
