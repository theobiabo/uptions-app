import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomModal } from "@/components/dialogs/custom-modal.tsx";
import { DashboardLayout } from "@/components/layout/dashboard-layout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { requireAuth } from "@/routes/-require-auth.ts";

export const Route = createFileRoute("/builder")({
	beforeLoad: requireAuth,
	component: SelectMarketFirst,
});

function SelectMarketFirst() {
	return (
		<DashboardLayout>
			<div className="min-h-[calc(100dvh-4rem)] bg-[var(--dashboard-bg)]" />
			<CustomModal
				className="border-app-border bg-app-card text-app-fg"
				description="Automation workflows are created from a specific market. Select a market first, then open the builder from that market page."
				onOpenChange={() => undefined}
				open
				showCloseButton={false}
				title="Select a market first"
			>
				<div className="flex justify-end pt-2">
					<Button
						asChild
						className="bg-primary text-primary-foreground hover:bg-primary/90"
					>
						<Link to="/markets">Choose a market</Link>
					</Button>
				</div>
			</CustomModal>
		</DashboardLayout>
	);
}
