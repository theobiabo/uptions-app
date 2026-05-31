import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout.tsx";
import type { WorkflowBlock } from "@/packages/builder/builder-data.ts";
import { defaultVenueId, type VenueId } from "@/packages/venues/venue-data.ts";
import { BlockLibrary } from "./block-library.tsx";
import { InspectorPanel } from "./inspector-panel.tsx";
import { WorkflowCanvas } from "./workflow-canvas.tsx";
import { WorkflowToolbar } from "./workflow-toolbar.tsx";

export function WorkflowBuilder() {
	const [selectedBlock, setSelectedBlock] = useState<WorkflowBlock>();
	const [venue, setVenue] = useState<VenueId>(defaultVenueId);

	return (
		<DashboardLayout contentClassName="p-0">
			<div className="flex h-[calc(100dvh-4rem)] min-h-[720px] w-full overflow-hidden bg-builder-panel text-white">
				<BlockLibrary />
				<section className="flex min-w-0 flex-1 flex-col">
					<WorkflowToolbar onVenueChange={setVenue} venue={venue} />
					<WorkflowCanvas onSelectBlock={setSelectedBlock} venue={venue} />
				</section>
				<InspectorPanel selectedBlock={selectedBlock} venue={venue} />
			</div>
		</DashboardLayout>
	);
}
