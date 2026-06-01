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
				</div>
			</div>
		</header>
	);
}

export default SiteHeader;
