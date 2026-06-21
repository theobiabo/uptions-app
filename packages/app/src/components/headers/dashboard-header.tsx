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
	const [authOpen, setAuthOpen] = useState(false);
	const accountLabel = user?.email ?? "Sign in";

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
							<div className="hidden h-9 max-w-[220px] items-center gap-2 border border-white/10 px-3 text-xs font-semibold text-white/70 sm:flex">
								<UserRound className="size-3.5 text-primary" />
								<span className="truncate">{accountLabel}</span>
							</div>
							<Button
								aria-label="Sign out"
								className="size-9 bg-transparent text-white/60 hover:bg-white/8 hover:text-white"
								onClick={logout}
								size="icon"
								type="button"
								variant="ghost"
							>
								<LogOut className="size-4" />
							</Button>
						</div>
					) : (
						<CustomModal
							className="border-white/10 bg-[var(--dashboard-bg)] p-0 text-white"
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
