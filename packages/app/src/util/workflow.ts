import type { Edge, Node } from "@xyflow/react";
import {
	initialWorkflowEdges,
	initialWorkflowNodes,
	type WorkflowBlock,
} from "@/packages/builder/builder-data.ts";

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
	return JSON.stringify({
		edges: state.edges.map((edge) => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			type: edge.type,
		})),
		nodes: state.nodes.map((node) => ({
			data: serializeWorkflowBlock(node.data),
			id: node.id,
			position: node.position,
			type: node.type,
		})),
	});
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
