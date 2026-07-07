import { useNavigate } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { CustomModal } from "@/components/dialogs/custom-modal.tsx";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { useCurrentUser, useLogout } from "@/hooks/use-auth.ts";
import { useAutomationAlerts } from "@/hooks/use-automations.ts";
import {
	dashboardActions,
	dashboardNavigationItems,
} from "@/packages/navigation/dashboard-navigation";
import type { AutomationAlert } from "@/packages/types/automation.types.ts";
import { formatDate } from "@/util/formatters.ts";
import Logo from "../misc/logo";

export default function DashboardHeader() {
	const NotificationsIcon = dashboardActions.notificationsIcon;
	const { user } = useCurrentUser();
	const logout = useLogout();
	const { alerts, isLoading: alertsLoading } = useAutomationAlerts();
	const navigate = useNavigate();
	const [authOpen, setAuthOpen] = useState(false);
	const [logoutOpen, setLogoutOpen] = useState(false);
	const accountLabel = user?.email ?? "Sign in";

	const handleConfirmLogout = () => {
		logout();
		setLogoutOpen(false);
		navigate({ to: "/" });
	};

	return (
		<header className="sticky top-0 z-30 border-b border-[var(--app-border)] bg-[var(--dashboard-bg)]/95 backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between px-5 sm:px-8">
				<Logo />

				<nav
					aria-label="Dashboard navigation"
					className="hidden items-center gap-9 md:flex"
				>
					{dashboardNavigationItems.map((item) => {
						const Icon = item.icon;

						return (
							<a
								className="inline-flex items-center gap-2 text-xs font-medium text-[var(--app-muted-fg)] no-underline transition hover:text-[var(--app-fg)]"
								href={item.href}
								key={item.label}
							>
								<Icon className="size-3.5" />
								{item.label}
							</a>
						);
					})}
				</nav>

				<div className="flex items-center gap-3">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								aria-label={dashboardActions.notificationsLabel}
								className="size-9 border-0 bg-transparent text-[var(--app-muted-fg)] hover:bg-[var(--app-muted)] hover:text-[var(--app-fg)]"
								size="icon"
								type="button"
								variant="ghost"
							>
								<NotificationsIcon className="size-4" />
							</Button>
						</SheetTrigger>
						<SheetContent className="border-app-border bg-app-card text-app-fg">
							<SheetHeader className="border-b border-app-border px-5 py-5">
								<SheetTitle className="text-app-fg">Notifications</SheetTitle>
								<SheetDescription className="text-app-muted-fg">
									Recent automation activity and alerts.
								</SheetDescription>
							</SheetHeader>
							<div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
								{alertsLoading ? (
									<div className="mt-5 grid gap-3">
										<div className="h-24 animate-pulse bg-app-muted" />
										<div className="h-24 animate-pulse bg-app-muted" />
										<div className="h-24 animate-pulse bg-app-muted" />
									</div>
								) : alerts.length > 0 ? (
									<div className="mt-5 grid gap-3">
										{alerts.map((alert) => (
											<NotificationItem alert={alert} key={alert.id} />
										))}
									</div>
								) : (
									<div className="grid min-h-60 place-items-center text-center">
										<div>
											<p className="text-sm font-semibold text-app-fg">
												No notifications yet
											</p>
											<p className="mt-2 text-sm text-app-muted-fg">
												Automation alerts will appear here.
											</p>
										</div>
									</div>
								)}
							</div>
						</SheetContent>
					</Sheet>
					<ThemeToggle />
					{user ? (
						<div className="flex items-center gap-2">
							<div className="hidden h-9 max-w-[220px] items-center gap-2 border border-app-border px-3 text-xs font-semibold text-app-muted-fg sm:flex">
								<UserRound className="size-3.5 text-primary" />
								<span className="truncate">{accountLabel}</span>
							</div>
							<CustomModal
								className="border-app-border bg-app-card text-app-fg"
								description="You will need to sign in again to manage automations and connected venues."
								onOpenChange={setLogoutOpen}
								open={logoutOpen}
								title="Sign out of Uptions?"
								trigger={
									<Button
										aria-label="Sign out"
										className="size-9 bg-transparent text-app-muted-fg hover:bg-app-muted hover:text-app-fg"
										size="icon"
										type="button"
										variant="ghost"
									>
										<LogOut className="size-4" />
									</Button>
								}
							>
								<div className="flex justify-end gap-3 pt-2">
									<Button
										className="border border-app-border bg-transparent text-app-fg hover:bg-app-muted"
										onClick={() => setLogoutOpen(false)}
										type="button"
										variant="ghost"
									>
										Cancel
									</Button>
									<Button
										className="bg-primary text-primary-foreground hover:bg-primary/90"
										onClick={handleConfirmLogout}
										type="button"
									>
										Confirm logout
									</Button>
								</div>
							</CustomModal>
						</div>
					) : (
						<CustomModal
							className="border-app-border bg-[var(--dashboard-bg)] p-0 text-app-fg"
							onOpenChange={setAuthOpen}
							open={authOpen}
							showHeader={false}
							title="Uptions account"
							trigger={
								<Button
									className="h-9 bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
									type="button"
								>
									<UserRound className="size-3.5" />
									Sign in
								</Button>
							}
						>
							<AuthPanel
								className="border-0"
								onAuthenticated={() => setAuthOpen(false)}
							/>
						</CustomModal>
					)}
				</div>
			</div>
		</header>
	);
}

function NotificationItem({ alert }: { alert: AutomationAlert }) {
	return (
		<article className="border border-app-border bg-app-muted p-4">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="text-sm font-semibold text-app-fg">{alert.title}</p>
					<p className="mt-2 text-sm leading-6 text-app-muted-fg">
						{alert.message}
					</p>
				</div>
				<span className="rounded-full bg-app-card px-3 py-1 text-xs font-semibold capitalize text-primary">
					{alert.status}
				</span>
			</div>
			<p className="mt-4 text-xs font-medium text-app-muted-fg">
				{formatDate(alert.created_at)}
			</p>
		</article>
	);
}
