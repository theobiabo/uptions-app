import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	type Connection,
	type Edge,
	type EdgeChange,
	type NodeChange,
	type XYPosition,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppKeyword } from "@/common";
import { DashboardLayout } from "@/components/layout/dashboard-layout.tsx";
import { CheckerBackground } from "@/components/misc/checker-background.tsx";
import {
	usePublishAutomation,
	useTestRunAutomation,
} from "@/hooks/use-automations.ts";
import { usePolymarketMarket } from "@/hooks/use-polymarket-markets.ts";
import {
	type WorkflowBlock,
	workflowBlocks,
} from "@/packages/builder/builder-data.ts";
import { normalizeMarket } from "@/packages/markets/market-utils.ts";
import { defaultVenueId, type VenueId } from "@/packages/venues/venue-data.ts";
import { getRequestErrorMessage } from "@/util/errors.ts";
import {
	appendWorkflowHistory,
	cloneWorkflowState,
	createInitialWorkflowState,
	serializeWorkflowBlock,
	serializeWorkflowState,
	toWorkflowPayload,
	type WorkflowNodeModel,
	type WorkflowState,
	workflowHistoryLimit,
} from "@/util/workflow.ts";
import { BlockLibrary } from "./block-library.tsx";
import { InspectorPanel } from "./inspector-panel.tsx";
import { WorkflowCanvas } from "./workflow-canvas.tsx";
import { WorkflowToolbar } from "./workflow-toolbar.tsx";

type WorkflowBuilderProps = {
	marketId?: string;
};

export function WorkflowBuilder({ marketId }: WorkflowBuilderProps) {
	const [workflow, setWorkflow] = useState<WorkflowState>(
		createInitialWorkflowState,
	);
	const [past, setPast] = useState<WorkflowState[]>([]);
	const [future, setFuture] = useState<WorkflowState[]>([]);
	const [selectedNodeId, setSelectedNodeId] = useState<string>();
	const [venue, setVenue] = useState<VenueId>(defaultVenueId);
	const [publishedAutomationId, setPublishedAutomationId] = useState<string>();
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const publishAutomation = usePublishAutomation();
	const testRunAutomation = useTestRunAutomation();
	const { market } = usePolymarketMarket(marketId);
	const selectedMarket = market ? normalizeMarket(market) : null;
	const workflowRef = useRef(workflow);
	const dragStartRef = useRef<WorkflowState | null>(null);
	const selectedBlock = useMemo(
		() => workflow.nodes.find((node) => node.id === selectedNodeId)?.data,
		[workflow.nodes, selectedNodeId],
	);
	const automationPayload = useMemo(
		() => ({
			market_id: marketId,
			market_title: selectedMarket?.title,
			title: selectedMarket?.title ?? AppKeyword.UntitledWorkflow,
			venue,
			workflow: toWorkflowPayload(workflow),
		}),
		[marketId, selectedMarket?.title, venue, workflow],
	);

	useEffect(() => {
		workflowRef.current = workflow;
	}, [workflow]);

	useEffect(() => {
		if (
			selectedNodeId &&
			!workflow.nodes.some((node) => node.id === selectedNodeId)
		) {
			setSelectedNodeId(undefined);
		}
	}, [selectedNodeId, workflow.nodes]);

	const commitWorkflow = useCallback(
		(updater: (current: WorkflowState) => WorkflowState, record = true) => {
			setWorkflow((current) => {
				const next = updater(current);

				if (
					current === next ||
					serializeWorkflowState(current) === serializeWorkflowState(next)
				) {
					return current;
				}

				if (record) {
					setPast((items) =>
						appendWorkflowHistory(items, cloneWorkflowState(current)),
					);
					setFuture([]);
				}

				return next;
			});
		},
		[],
	);

	const handleNodesChange = useCallback(
		(changes: NodeChange<WorkflowNodeModel>[]) => {
			const record = changes.some(
				(change) => change.type !== "select" && change.type !== "position",
			);

			commitWorkflow(
				(current) => ({
					...current,
					nodes: applyNodeChanges(changes, current.nodes),
				}),
				record,
			);
		},
		[commitWorkflow],
	);

	const handleEdgesChange = useCallback(
		(changes: EdgeChange<Edge>[]) => {
			const record = changes.some((change) => change.type !== "select");

			commitWorkflow(
				(current) => ({
					...current,
					edges: applyEdgeChanges(changes, current.edges),
				}),
				record,
			);
		},
		[commitWorkflow],
	);

	const handleConnect = useCallback(
		(connection: Connection) => {
			commitWorkflow((current) => ({
				...current,
				edges: addEdge(
					{
						...connection,
						type: "smoothstep",
						style: { stroke: "var(--primary)", strokeWidth: 2 },
					},
					current.edges,
				),
			}));
		},
		[commitWorkflow],
	);

	const handleAddNode = useCallback(
		(blockId: string, position: XYPosition) => {
			const block = workflowBlocks.find((item) => item.id === blockId);

			if (!block) {
				return;
			}

			const nodeId = `${block.id}-${crypto.randomUUID()}`;

			commitWorkflow((current) => ({
				...current,
				nodes: current.nodes.concat({
					data: { ...block, venue },
					id: nodeId,
					position,
					type: "workflowBlock",
				}),
			}));
			setSelectedNodeId(nodeId);
		},
		[commitWorkflow, venue],
	);

	const handleUpdateSelectedBlock = useCallback(
		(updates: Partial<WorkflowBlock>) => {
			if (!selectedNodeId) {
				return;
			}

			commitWorkflow((current) => {
				let changed = false;
				const nodes = current.nodes.map((node) => {
					if (node.id !== selectedNodeId) {
						return node;
					}

					const data = { ...node.data, ...updates };

					if (
						serializeWorkflowBlock(node.data) === serializeWorkflowBlock(data)
					) {
						return node;
					}

					changed = true;

					return { ...node, data };
				});

				return changed ? { ...current, nodes } : current;
			});
		},
		[commitWorkflow, selectedNodeId],
	);

	const handleNodeDragStart = useCallback(() => {
		dragStartRef.current = cloneWorkflowState(workflowRef.current);
	}, []);

	const handleNodeDragStop = useCallback(() => {
		const snapshot = dragStartRef.current;
		dragStartRef.current = null;

		if (
			!snapshot ||
			serializeWorkflowState(snapshot) ===
				serializeWorkflowState(workflowRef.current)
		) {
			return;
		}

		setPast((items) => appendWorkflowHistory(items, snapshot));
		setFuture([]);
	}, []);

	const handleUndo = useCallback(() => {
		setPast((items) => {
			if (items.length === 0) {
				return items;
			}

			const previous = items.at(-1);

			if (!previous) {
				return items;
			}

			setFuture((redoItems) =>
				[cloneWorkflowState(workflowRef.current), ...redoItems].slice(
					0,
					workflowHistoryLimit,
				),
			);
			setWorkflow(cloneWorkflowState(previous));

			return items.slice(0, -1);
		});
	}, []);

	const handleRedo = useCallback(() => {
		setFuture((items) => {
			if (items.length === 0) {
				return items;
			}

			const next = items[0];

			if (!next) {
				return items;
			}

			setPast((undoItems) =>
				appendWorkflowHistory(
					undoItems,
					cloneWorkflowState(workflowRef.current),
				),
			);
			setWorkflow(cloneWorkflowState(next));

			return items.slice(1);
		});
	}, []);

	const handlePublish = useCallback(async () => {
		setStatusMessage(null);

		try {
			const response = await publishAutomation.mutateAsync(automationPayload);
			setPublishedAutomationId(response.data.id);
			setStatusMessage("Automation published and ready to run.");
		} catch (error) {
			setStatusMessage(
				getRequestErrorMessage(error, "Unable to publish automation"),
			);
		}
	}, [automationPayload, publishAutomation]);

	const handleTestRun = useCallback(async () => {
		setStatusMessage(null);

		try {
			const response = await testRunAutomation.mutateAsync({
				...automationPayload,
				automation_id: publishedAutomationId,
			});
			setStatusMessage(response.data.message);
		} catch (error) {
			setStatusMessage(
				getRequestErrorMessage(error, "Unable to test run automation"),
			);
		}
	}, [automationPayload, publishedAutomationId, testRunAutomation]);

	return (
		<DashboardLayout contentClassName="p-0">
			<div className="relative flex h-[calc(100dvh-4rem)] min-h-[720px] w-full overflow-hidden bg-builder-bg text-[var(--app-fg)]">
				<CheckerBackground className="opacity-70" variant="builder" />
				<BlockLibrary />
				<section className="relative z-10 flex min-w-0 flex-1 flex-col">
					<WorkflowToolbar
						canRedo={future.length > 0}
						canUndo={past.length > 0}
						isPublishing={publishAutomation.isPending}
						isTesting={testRunAutomation.isPending}
						market={selectedMarket}
						onPublish={handlePublish}
						onRedo={handleRedo}
						onTestRun={handleTestRun}
						onUndo={handleUndo}
						onVenueChange={setVenue}
						statusMessage={statusMessage}
						venue={venue}
					/>
					<WorkflowCanvas
						edges={workflow.edges}
						nodes={workflow.nodes}
						onAddNode={handleAddNode}
						onConnect={handleConnect}
						onEdgesChange={handleEdgesChange}
						onNodeDragStart={handleNodeDragStart}
						onNodeDragStop={handleNodeDragStop}
						onNodesChange={handleNodesChange}
						onSelectNode={setSelectedNodeId}
					/>
				</section>
				<InspectorPanel
					market={selectedMarket}
					onUpdateBlock={handleUpdateSelectedBlock}
					selectedBlock={selectedBlock}
					venue={venue}
				/>
			</div>
		</DashboardLayout>
	);
}
