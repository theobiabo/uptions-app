import type { ReactNode } from "react";

import DashboardHeader from "@/components/headers/dashboard-header";
import { useAutomationAlertStream } from "@/hooks/use-automations.ts";
import { cn } from "@/lib/utils.ts";

type DashboardLayoutProps = {
	children: ReactNode;
	className?: string;
	contentClassName?: string;
};

export function DashboardLayout({
	children,
	className,
	contentClassName,
}: DashboardLayoutProps) {
	useAutomationAlertStream();

	return (
		<main
			className={cn(
				"flex min-h-screen flex-col bg-[var(--dashboard-bg)] text-[var(--app-fg)]",
				className,
			)}
		>
			<DashboardHeader />
			<div className={cn("w-full flex-1", contentClassName)}>{children}</div>
		</main>
	);
}
