import {
	Clock3,
	DollarSign,
	Search,
	ShoppingCart,
	TrendingUp,
	Zap,
} from "lucide-react";
import type { VenueId } from "@/packages/venues/venue-data.ts";
import { defaultVenueId } from "@/packages/venues/venue-data.ts";

export const workflowBlockKind = {
	trigger: "trigger",
	condition: "condition",
	action: "action",
} as const;

export type WorkflowBlockKind =
	(typeof workflowBlockKind)[keyof typeof workflowBlockKind];

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

export const workflowBlocks = [
	{
		id: "price-change",
		kind: workflowBlockKind.trigger,
		title: "Price Change",
		description: "When price moves by %",
		value: "BTC > 5%",
		venue: defaultVenueId,
		icon: Zap,
	},
	{
		id: "volume-spike",
		kind: workflowBlockKind.trigger,
		title: "Volume Spike",
		description: "Volume exceeds threshold",
		value: "Volume > 20%",
		venue: defaultVenueId,
		icon: Zap,
	},
	{
		id: "time-trigger",
		kind: workflowBlockKind.trigger,
		title: "Time Trigger",
		description: "At specific time",
		value: "Every 1 hour",
		venue: defaultVenueId,
		icon: Clock3,
	},
	{
		id: "price-above",
		kind: workflowBlockKind.condition,
		title: "Price Above",
		description: "If price > value",
		value: "$95,000",
		venue: defaultVenueId,
		icon: TrendingUp,
	},
	{
		id: "price-below",
		kind: workflowBlockKind.condition,
		title: "Price Below",
		description: "If price < value",
		value: "$88,000",
		venue: defaultVenueId,
		icon: TrendingUp,
	},
	{
		id: "position-size",
		kind: workflowBlockKind.condition,
		title: "Position Size",
		description: "Position meets criteria",
		value: "$1,000 max",
		venue: defaultVenueId,
		icon: DollarSign,
	},
	{
		id: "buy",
		kind: workflowBlockKind.action,
		title: "Buy",
		description: "Execute buy order",
		value: "Execute buy order",
		venue: defaultVenueId,
		icon: ShoppingCart,
	},
	{
		id: "sell",
		kind: workflowBlockKind.action,
		title: "Sell",
		description: "Execute sell order",
		value: "Execute sell order",
		venue: defaultVenueId,
		icon: ShoppingCart,
	},
	{
		id: "alert",
		kind: workflowBlockKind.action,
		title: "Alert",
		description: "Send notification",
		value: "Send notification",
		venue: defaultVenueId,
		icon: Search,
	},
] as const;

export type WorkflowBlock = Omit<(typeof workflowBlocks)[number], "venue"> & {
	venue: VenueId;
};

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

export const initialWorkflowNodes = [
	{
		id: "node-price-change",
		type: "workflowBlock",
		position: { x: 180, y: 210 },
		data: workflowBlocks[0],
	},
	{
		id: "node-price-above",
		type: "workflowBlock",
		position: { x: 420, y: 330 },
		data: workflowBlocks[3],
	},
	{
		id: "node-buy",
		type: "workflowBlock",
		position: { x: 680, y: 460 },
		data: workflowBlocks[6],
	},
] as const;

export const initialWorkflowEdges = [
	{
		id: "edge-trigger-condition",
		source: "node-price-change",
		target: "node-price-above",
		type: "smoothstep",
		style: { stroke: "var(--primary)", strokeWidth: 2 },
	},
	{
		id: "edge-condition-action",
		source: "node-price-above",
		target: "node-buy",
		type: "smoothstep",
		style: { stroke: "var(--primary)", strokeWidth: 2 },
	},
] as const;
