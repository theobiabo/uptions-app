import { LaunchDialog } from "@/components/auth/launch-dialog.tsx";
import SiteHeader from "@/components/headers/index-header.tsx";
import { CheckerBackground } from "@/components/misc/checker-background.tsx";
import { Typography } from "@/components/typography/typography.tsx";

export function Homepage() {
	return (
		<main className="min-h-screen bg-[var(--marketing-bg)] text-[var(--app-fg)]">
			<SiteHeader />
			<HeroSection />
		</main>
	);
}

function HeroSection() {
	return (
		<section className="relative mt-[3rem] min-h-[calc(100vh-7.75rem)] overflow-hidden border-[var(--app-border)]">
			<CheckerBackground />
			<div className="relative z-10 mx-auto flex min-h-[620px] max-w-[1040px] flex-col items-center justify-center px-6 py-20 text-center">
				<Typography
					className="max-w-[710px] text-[var(--app-fg)] font-normal"
					variant="hero"
				>
					Automate Prediction Market Strategies Easily.
				</Typography>
				<Typography
					className="mt-7 max-w-[620px] text-[var(--app-muted-fg)]"
					variant="bodySm"
				>
					Design trading approach visually, by using a comprehensive suite of
					tools to receive instant alerts and execute complex strategies with,
					speed, and reliability, all within the our platform.
				</Typography>
				<div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<LaunchDialog buttonClassName="h-11 px-6" />
				</div>
			</div>
		</section>
	);
}
