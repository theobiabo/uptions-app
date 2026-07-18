import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout.tsx";
import { AlertsSection } from "@/components/module/dashboard/alerts-section.tsx";
import { AutomationSection } from "@/components/module/dashboard/automation-section.tsx";
import { OrdersContent } from "@/components/module/orders/orders-page.tsx";
import UserPortfolioOverview from "@/components/module/profile/users-wallet.tsx";
import { cn } from "@/lib/utils.ts";

const dashboardTab = {
	automations: "automations",
	orders: "orders",
} as const;

type DashboardTab = (typeof dashboardTab)[keyof typeof dashboardTab];

const dashboardTabs: Array<{ id: DashboardTab; label: string }> = [
	{ id: dashboardTab.automations, label: "Automations" },
	{ id: dashboardTab.orders, label: "Orders" },
];

export function Dashboard() {
	const [activeTab, setActiveTab] = useState<DashboardTab>(
		dashboardTab.automations,
	);

	return (
		<DashboardLayout contentClassName="px-5 py-7 sm:px-8 sm:py-10">
			<div className="mx-auto grid w-full max-w-[1500px] gap-7">
				<UserPortfolioOverview />

				<div className="overflow-x-auto border-b border-app-border">
					<div
						aria-label="Account workspace"
						className="flex min-w-max gap-7"
						role="tablist"
					>
						{dashboardTabs.map((tab) => (
							<button
								aria-selected={activeTab === tab.id}
								className={cn(
									"relative min-h-12 border-b-2 px-1 text-sm font-semibold transition",
									activeTab === tab.id
										? "border-primary text-app-fg"
										: "border-transparent text-app-muted-fg hover:text-app-fg",
								)}
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								role="tab"
								type="button"
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				{activeTab === dashboardTab.automations ? (
					<div
						aria-label="Automations"
						className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_330px]"
						role="tabpanel"
					>
						<AutomationSection />
						<AlertsSection />
					</div>
				) : (
					<div aria-label="Orders" role="tabpanel">
						<OrdersContent embedded />
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
