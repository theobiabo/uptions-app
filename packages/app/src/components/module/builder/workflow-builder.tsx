import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout.tsx";
import { CheckerBackground } from "@/components/misc/checker-background.tsx";
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
			<div className="relative flex h-[calc(100dvh-4rem)] min-h-[720px] w-full overflow-hidden bg-builder-bg text-[var(--app-fg)]">
				<CheckerBackground className="opacity-70" variant="builder" />
				<BlockLibrary />
				<section className="relative z-10 flex min-w-0 flex-1 flex-col">
					<WorkflowToolbar onVenueChange={setVenue} venue={venue} />
					<WorkflowCanvas onSelectBlock={setSelectedBlock} venue={venue} />
				</section>
				<InspectorPanel selectedBlock={selectedBlock} venue={venue} />
			</div>
		</DashboardLayout>
	);
}
