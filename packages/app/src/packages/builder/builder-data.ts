import type { Edge, Node } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import {
	Bell,
	Clock3,
	Gauge,
	LineChart,
	ShoppingCart,
	TrendingDown,
	TrendingUp,
	Zap,
} from "lucide-react";
import type {
	AutomationStepKind,
	WorkflowActionType,
	WorkflowStepParams,
} from "@/packages/types/automation.types.ts";
import {
	automationStepKind,
	workflowActionType,
	workflowMessageChannel,
	workflowOperator,
	workflowOrderType,
	workflowOutcome,
} from "@/packages/types/automation.types.ts";
import type { VenueId } from "@/packages/venues/venue-data.ts";
import { defaultVenueId } from "@/packages/venues/venue-data.ts";

export const workflowBlockKind = automationStepKind;

export type WorkflowBlockKind = AutomationStepKind;

export type WorkflowBlock = {
	action: WorkflowActionType;
	description: string;
	icon: LucideIcon;
	id: string;
	kind: WorkflowBlockKind;
	params: WorkflowStepParams;
	title: string;
	value: string;
	venue: VenueId;
};

export const workflowBlockTone = {
	[workflowBlockKind.trigger]: {
		card: "border-primary bg-primary/15",
		icon: "bg-primary text-primary-foreground",
		label: "TRIGGER",
	},
	[workflowBlockKind.condition]: {
		card: "border-violet bg-violet/15",
		icon: "bg-violet text-violet-foreground",
		label: "CONDITION",
	},
	[workflowBlockKind.action]: {
		card: "border-success bg-success/15",
		icon: "bg-success text-success-foreground",
		label: "ACTION",
	},
} as const;

export function formatWorkflowBlockValue(
	block: Pick<WorkflowBlock, "action" | "params">,
) {
	const outcome = String(block.params.outcome ?? workflowOutcome.yes);

	if (block.action === workflowActionType.triggerPriceMoves) {
		return `Watch ${outcome} price movement`;
	}

	if (block.action === workflowActionType.triggerVolumeMoves) {
		return `Watch volume changes over ${block.params.minimum_change_percent}%`;
	}

	if (block.action === workflowActionType.triggerTimeCheck) {
		return `Check every ${block.params.interval ?? "1h"}`;
	}

	if (block.action === workflowActionType.conditionOutcomePriceAbove) {
		return `${outcome} price is above $${block.params.price ?? "0.65"}`;
	}

	if (block.action === workflowActionType.conditionOutcomePriceBelow) {
		return `${outcome} price is below $${block.params.price ?? "0.35"}`;
	}

	if (block.action === workflowActionType.conditionVolumeAbove) {
		return `Market volume is above $${block.params.volume ?? "50000"}`;
	}

	if (block.action === workflowActionType.buy) {
		return `Buy ${outcome} for $${block.params.amount ?? "10"}`;
	}

	if (block.action === workflowActionType.sell) {
		return `Sell ${outcome} for $${block.params.amount ?? "10"}`;
	}

	return String(block.params.message ?? "Send in-app notification");
}

function block(block: Omit<WorkflowBlock, "value" | "venue">): WorkflowBlock {
	return {
		...block,
		value: formatWorkflowBlockValue(block),
		venue: defaultVenueId,
	};
}

export const workflowBlocks: WorkflowBlock[] = [
	block({
		action: workflowActionType.triggerPriceMoves,
		id: "price-moves",
		kind: workflowBlockKind.trigger,
		title: "Price Moves",
		description: "When an outcome price changes",
		params: {
			outcome: workflowOutcome.yes,
		},
		icon: Zap,
	}),
	block({
		action: workflowActionType.triggerVolumeMoves,
		id: "volume-moves",
		kind: workflowBlockKind.trigger,
		title: "Volume Moves",
		description: "When market volume changes",
		params: {
			minimum_change_percent: 10,
		},
		icon: LineChart,
	}),
	block({
		action: workflowActionType.triggerTimeCheck,
		id: "time-check",
		kind: workflowBlockKind.trigger,
		title: "Time Check",
		description: "Check this market on a schedule",
		params: {
			interval: "1h",
		},
		icon: Clock3,
	}),
	block({
		action: workflowActionType.conditionOutcomePriceAbove,
		id: "outcome-price-above",
		kind: workflowBlockKind.condition,
		title: "Outcome Price Above",
		description: "If YES or NO is above a target price",
		params: {
			operator: workflowOperator.above,
			outcome: workflowOutcome.yes,
			price: 0.65,
		},
		icon: TrendingUp,
	}),
	block({
		action: workflowActionType.conditionOutcomePriceBelow,
		id: "outcome-price-below",
		kind: workflowBlockKind.condition,
		title: "Outcome Price Below",
		description: "If YES or NO is below a target price",
		params: {
			operator: workflowOperator.below,
			outcome: workflowOutcome.no,
			price: 0.35,
		},
		icon: TrendingDown,
	}),
	block({
		action: workflowActionType.conditionVolumeAbove,
		id: "volume-above",
		kind: workflowBlockKind.condition,
		title: "Volume Above",
		description: "If market volume is above a target",
		params: {
			operator: workflowOperator.above,
			volume: 50_000,
		},
		icon: Gauge,
	}),
	block({
		action: workflowActionType.buy,
		id: "buy-outcome",
		kind: workflowBlockKind.action,
		title: "Buy Outcome",
		description: "Buy YES or NO when conditions pass",
		params: {
			amount: 10,
			order_type: workflowOrderType.market,
			outcome: workflowOutcome.yes,
		},
		icon: ShoppingCart,
	}),
	block({
		action: workflowActionType.sell,
		id: "sell-outcome",
		kind: workflowBlockKind.action,
		title: "Sell Outcome",
		description: "Sell YES or NO when conditions pass",
		params: {
			amount: 10,
			order_type: workflowOrderType.market,
			outcome: workflowOutcome.no,
		},
		icon: ShoppingCart,
	}),
	block({
		action: workflowActionType.sendMessage,
		id: "send-message",
		kind: workflowBlockKind.action,
		title: "Send Message",
		description: "Notify me when conditions pass",
		params: {
			channel: workflowMessageChannel.inApp,
			message: "Market condition met",
		},
		icon: Bell,
	}),
];

export const workflowBlockGroups = [
	{
		title: "TRIGGERS",
		kind: workflowBlockKind.trigger,
		blocks: workflowBlocks.filter(
			(block) => block.kind === workflowBlockKind.trigger,
		),
	},
	{
		title: "CONDITIONS",
		kind: workflowBlockKind.condition,
		blocks: workflowBlocks.filter(
			(block) => block.kind === workflowBlockKind.condition,
		),
	},
	{
		title: "ACTIONS",
		kind: workflowBlockKind.action,
		blocks: workflowBlocks.filter(
			(block) => block.kind === workflowBlockKind.action,
		),
	},
] as const;

export const initialWorkflowNodes: Node<WorkflowBlock>[] = [];

export const initialWorkflowEdges: Edge[] = [];
