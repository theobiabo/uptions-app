import { Wallet } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useWalletLogin } from "@/hooks/use-auth.ts";
import {
	dashboardActions,
	dashboardNavigationItems,
} from "@/packages/navigation/dashboard-navigation";
import Logo from "../misc/logo";

export default function DashboardHeader() {
	const NotificationsIcon = dashboardActions.notificationsIcon;
	const { user } = useCurrentUser();
	const walletLogin = useWalletLogin();
	const walletLabel = user
		? formatWallet(user.primary_wallet_address)
		: dashboardActions.walletLabel;

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
					<Button
						className="h-9 bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
						disabled={walletLogin.isPending || Boolean(user)}
						onClick={() => walletLogin.mutate()}
						type="button"
					>
						<Wallet className="size-3.5" />
						{walletLogin.isPending ? "Connecting" : walletLabel}
					</Button>
				</div>
			</div>
		</header>
	);
}

function formatWallet(address: string) {
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
