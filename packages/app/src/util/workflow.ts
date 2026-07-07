import type { Edge, Node } from "@xyflow/react";
import {
	initialWorkflowEdges,
	initialWorkflowNodes,
	type WorkflowBlock,
} from "@/packages/builder/builder-data.ts";
import type { WorkflowPayload } from "@/packages/types/automation.types.ts";

export type WorkflowNodeModel = Node<WorkflowBlock>;

export type WorkflowState = {
	edges: Edge[];
	nodes: WorkflowNodeModel[];
};

export const workflowHistoryLimit = 50;

export function createInitialWorkflowState(): WorkflowState {
	return {
		edges: initialWorkflowEdges.map((edge) => ({
			...edge,
			style: { ...edge.style },
		})),
		nodes: initialWorkflowNodes.map((node) => ({
			...node,
			data: { ...node.data },
			position: { ...node.position },
		})),
	};
}

export function appendWorkflowHistory(
	items: WorkflowState[],
	state: WorkflowState,
) {
	return items.concat(state).slice(-workflowHistoryLimit);
}

export function cloneWorkflowState(state: WorkflowState): WorkflowState {
	return {
		edges: state.edges.map((edge) => ({
			...edge,
			style: edge.style ? { ...edge.style } : undefined,
		})),
		nodes: state.nodes.map((node) => ({
			...node,
			data: { ...node.data },
			position: { ...node.position },
		})),
	};
}

export function serializeWorkflowState(state: WorkflowState) {
	return JSON.stringify(toWorkflowPayload(state));
}

export function toWorkflowPayload(state: WorkflowState): WorkflowPayload {
	return {
		edges: state.edges.map((edge) => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			type: edge.type,
		})),
		nodes: state.nodes.map((node) => ({
			data: {
				description: node.data.description,
				id: node.data.id,
				kind: node.data.kind,
				title: node.data.title,
				value: node.data.value,
				venue: node.data.venue,
			},
			id: node.id,
			position: node.position,
			type: node.type,
		})),
	};
}

export function serializeWorkflowBlock(block: WorkflowBlock) {
	return JSON.stringify({
		description: block.description,
		id: block.id,
		kind: block.kind,
		title: block.title,
		value: block.value,
		venue: block.venue,
	});
}
