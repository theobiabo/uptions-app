import { useState } from "react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Logo from "../misc/logo";
import { ThemeToggle } from "../theme/theme-toggle";

function SiteHeader() {
	const [authOpen, setAuthOpen] = useState(false);

	return (
		<header className="sticky top-0 z-30  bg-[var(--app-surface)]/95 backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
				<div className="flex items-center gap-9">
					<Logo />
				</div>

				<div className="flex items-center gap-3">
					<ThemeToggle />
					<Dialog onOpenChange={setAuthOpen} open={authOpen}>
						<DialogTrigger asChild>
							<Button
								className="h-9 bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
								type="button"
							>
								Get started
							</Button>
						</DialogTrigger>
						<DialogContent className="border-white/10 bg-[var(--dashboard-bg)] p-0 text-white">
							<DialogTitle className="sr-only">Uptions account</DialogTitle>
							<AuthPanel
								className="border-0"
								onAuthenticated={() => setAuthOpen(false)}
							/>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</header>
	);
}

export default SiteHeader;
