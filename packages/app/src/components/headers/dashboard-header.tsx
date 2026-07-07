import { useNavigate } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { CustomModal } from "@/components/dialogs/custom-modal.tsx";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogout } from "@/hooks/use-auth.ts";
import {
	dashboardActions,
	dashboardNavigationItems,
} from "@/packages/navigation/dashboard-navigation";
import Logo from "../misc/logo";

export default function DashboardHeader() {
	const NotificationsIcon = dashboardActions.notificationsIcon;
	const { user } = useCurrentUser();
	const logout = useLogout();
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
					<Button
						aria-label={dashboardActions.notificationsLabel}
						className="size-9  border-0 bg-transparent text-[var(--app-muted-fg)] hover:bg-[var(--app-muted)] hover:text-[var(--app-fg)]"
						size="icon"
						type="button"
						variant="ghost"
					>
						<NotificationsIcon className="size-4" />
					</Button>
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
