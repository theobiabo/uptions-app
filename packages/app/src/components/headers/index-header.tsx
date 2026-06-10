import { LaunchDialog } from "@/components/auth/launch-dialog";
import Logo from "../misc/logo";
import { ThemeToggle } from "../theme/theme-toggle";

function SiteHeader() {
	return (
		<header className="sticky top-0 z-30  bg-[var(--app-surface)]/95 backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
				<div className="flex items-center gap-9">
					<Logo />
				</div>

				<div className="flex items-center gap-3">
					<ThemeToggle />
					<LaunchDialog buttonClassName="h-9 bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90" />
				</div>
			</div>
		</header>
	);
}

export default SiteHeader;
