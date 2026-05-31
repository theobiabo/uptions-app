import "@xyflow/react/dist/style.css";

import {
	addEdge,
	Background,
	type Connection,
	type Edge,
	type Node,
	ReactFlow,
	type ReactFlowInstance,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import type { DragEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import type { WorkflowBlock } from "@/packages/builder/builder-data.ts";
import {
	initialWorkflowEdges,
	initialWorkflowNodes,
	workflowBlocks,
} from "@/packages/builder/builder-data.ts";
import type { VenueId } from "@/packages/venues/venue-data.ts";

import { WorkflowNode } from "./workflow-node.tsx";

type WorkflowCanvasProps = {
	onSelectBlock: (block?: WorkflowBlock) => void;
	venue: VenueId;
};

type WorkflowNodeData = WorkflowBlock;

export function WorkflowCanvas({ onSelectBlock, venue }: WorkflowCanvasProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
		Node<WorkflowNodeData>,
		Edge
	> | null>(null);
	const [nodes, setNodes, onNodesChange] = useNodesState<
		Node<WorkflowNodeData>
	>(initialWorkflowNodes.map((node) => ({ ...node })));
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
		initialWorkflowEdges.map((edge) => ({ ...edge })),
	);
	const nodeTypes = useMemo(() => ({ workflowBlock: WorkflowNode }), []);

	const onConnect = useCallback(
		(connection: Connection) => {
			setEdges((currentEdges) =>
				addEdge(
					{
						...connection,
						type: "smoothstep",
						style: { stroke: "var(--primary)", strokeWidth: 2 },
					},
					currentEdges,
				),
			);
		},
		[setEdges],
	);

	const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event: DragEvent<HTMLDivElement>) => {
			event.preventDefault();

			const blockId = event.dataTransfer.getData("application/uptions-block");
			const block = workflowBlocks.find((item) => item.id === blockId);

			if (!block || !reactFlowInstance || !wrapperRef.current) {
				return;
			}

			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});
			const node: Node<WorkflowNodeData> = {
				id: `${block.id}-${crypto.randomUUID()}`,
				type: "workflowBlock",
				position,
				data: { ...block, venue },
			};

			setNodes((currentNodes) => currentNodes.concat(node));
		},
		[reactFlowInstance, setNodes, venue],
	);

	return (
		<div
			aria-label="Workflow canvas"
			className="min-h-0 flex-1 bg-builder-bg"
			onDragOver={onDragOver}
			onDrop={onDrop}
			ref={wrapperRef}
			role="application"
		>
			<ReactFlow
				colorMode="dark"
				defaultViewport={{ x: 80, y: 60, zoom: 1.05 }}
				edges={edges}
				fitView
				maxZoom={1.6}
				minZoom={0.4}
				nodeTypes={nodeTypes}
				nodes={nodes}
				onConnect={onConnect}
				onEdgesChange={onEdgesChange}
				onInit={setReactFlowInstance}
				onNodeClick={(_, node) => onSelectBlock(node.data)}
				onNodesChange={onNodesChange}
				onPaneClick={() => onSelectBlock(undefined)}
				proOptions={{ hideAttribution: true }}
			>
				<Background
					bgColor="var(--builder-bg)"
					color="var(--builder-panel)"
					gap={16}
					size={1}
				/>
			</ReactFlow>
		</div>
	);
}
