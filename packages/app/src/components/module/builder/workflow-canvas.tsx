import "@xyflow/react/dist/style.css";

import {
	Background,
	type Connection,
	type Edge,
	type EdgeChange,
	type Node,
	type NodeChange,
	ReactFlow,
	type ReactFlowInstance,
	type XYPosition,
} from "@xyflow/react";
import type { DragEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import { useTheme } from "@/components/theme/theme-provider.tsx";
import type { WorkflowBlock } from "@/packages/builder/builder-data.ts";

import { WorkflowNode } from "./workflow-node.tsx";

type WorkflowNodeData = WorkflowBlock;

type WorkflowCanvasProps = {
	edges: Edge[];
	nodes: Node<WorkflowNodeData>[];
	onAddNode: (blockId: string, position: XYPosition) => void;
	onConnect: (connection: Connection) => void;
	onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
	onNodeDragStart: () => void;
	onNodeDragStop: () => void;
	onNodesChange: (changes: NodeChange<Node<WorkflowNodeData>>[]) => void;
	onSelectNode: (nodeId?: string) => void;
};

export function WorkflowCanvas({
	edges,
	nodes,
	onAddNode,
	onConnect,
	onEdgesChange,
	onNodeDragStart,
	onNodeDragStop,
	onNodesChange,
	onSelectNode,
}: WorkflowCanvasProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const { theme } = useTheme();
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
		Node<WorkflowNodeData>,
		Edge
	> | null>(null);
	const nodeTypes = useMemo(() => ({ workflowBlock: WorkflowNode }), []);

	const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event: DragEvent<HTMLDivElement>) => {
			event.preventDefault();

			const blockId = event.dataTransfer.getData("application/uptions-block");

			if (!blockId || !reactFlowInstance || !wrapperRef.current) {
				return;
			}

			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});

			onAddNode(blockId, position);
		},
		[onAddNode, reactFlowInstance],
	);

	return (
		<div
			aria-label="Workflow canvas"
			className="relative min-h-0 flex-1 overflow-hidden bg-transparent"
			onDragOver={onDragOver}
			onDrop={onDrop}
			ref={wrapperRef}
			role="application"
		>
			<ReactFlow
				className="relative z-10"
				colorMode={theme}
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
				onNodeClick={(_, node) => onSelectNode(node.id)}
				onNodeDragStart={onNodeDragStart}
				onNodeDragStop={onNodeDragStop}
				onNodesChange={onNodesChange}
				onPaneClick={() => onSelectNode(undefined)}
				proOptions={{ hideAttribution: true }}
			>
				<Background
					bgColor="transparent"
					color="var(--app-border)"
					gap={16}
					size={1}
				/>
			</ReactFlow>
		</div>
	);
}
