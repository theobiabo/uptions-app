import { Bell, Command, Moon, Settings2 } from "lucide-react";
import type { ReactNode } from "react";

import { Typography } from "@/components/typography/typography.tsx";
import { cn } from "@/lib/utils.ts";
import { dashboardNavigationItems } from "@/packages/navigation/dashboard-navigation.ts";

type ProductShellProps = {
	active: string;
	children: ReactNode;
};

export function ProductShell({ active, children }: ProductShellProps) {
	return (
		<main className="min-h-screen bg-dashboard-bg text-app-fg">
			<aside className="fixed inset-y-0 left-0 z-30 hidden w-[190px] border-r border-app-border bg-app-card lg:flex lg:flex-col">
				<div className="flex h-[54px] items-center gap-2 border-b border-app-border px-3">
					<span className="grid size-7 place-items-center rounded bg-app-fg text-app-bg">
						<Command className="size-5" />
					</span>
					<Typography className="text-app-fg" variant="h3">
						Uptions
					</Typography>
				</div>
				<nav className="grid gap-1 px-2 py-4">
					{dashboardNavigationItems.map((item) => {
						const Icon = item.icon;
						const isActive = item.label === active;

						return (
							<a
								className={cn(
									"flex h-9 items-center gap-3  px-3 text-sm no-underline",
									isActive
										? "bg-app-muted text-app-fg"
										: "text-app-fg/58 hover:bg-app-muted hover:text-app-fg",
								)}
								href={item.href}
								key={item.label}
							>
								<Icon className="size-4" />
								{item.label}
							</a>
						);
					})}
				</nav>
				<div className="mt-auto border-t border-app-border p-4">
					<div className="flex items-center gap-3 text-sm text-app-fg/58">
						<Moon className="size-4" />
						Light
					</div>
					<div className="mt-4 flex items-center gap-2 text-xs text-app-muted-fg">
						<span className="rounded border border-app-border bg-app-muted px-1.5 py-0.5">
							⌘ K
						</span>
						for commands
					</div>
				</div>
			</aside>
			<header className="sticky top-0 z-20 flex h-[54px] items-center justify-end border-b border-app-border bg-app-card px-4 lg:ml-[190px]">
				<div className="flex items-center gap-5">
					<div className="hidden h-8 items-center gap-3  border border-app-border bg-builder-panel px-3 text-sm text-app-muted-fg sm:flex">
						<span className="size-2  bg-success" />
						0x742d...0bEb
					</div>
					<div className="relative">
						<Bell className="size-5 text-app-muted-fg" />
						<span className="absolute -right-2 -top-2 grid size-4 place-items-center bg-app-fg text-[10px] font-bold text-app-bg">
							2
						</span>
					</div>
				</div>
			</header>
			<div className="lg:ml-[190px]">{children}</div>
		</main>
	);
}

export function ViewToggle() {
	return (
		<div className="flex h-8 items-center  bg-app-muted p-1">
			<Settings2 className="size-5 rounded px-0.5 text-app-muted-fg" />
			<div className="grid size-6 place-items-center rounded bg-app-fg text-app-bg">
				<span className="grid size-3 grid-cols-2 gap-0.5">
					<span className="bg-current" />
					<span className="bg-current" />
					<span className="bg-current" />
					<span className="bg-current" />
				</span>
			</div>
		</div>
	);
}
