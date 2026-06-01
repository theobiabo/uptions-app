import type { FormEvent } from "react";
import { useState } from "react";
import { CustomModal } from "@/components/dialogs/custom-modal.tsx";
import { ApiError } from "@/components/errors/api.error.ts";
import SiteHeader from "@/components/headers/index-header.tsx";
import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useJoinWaitlist } from "@/hooks/use-join-waitlist.ts";

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
			<HeroBackground />
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
					<WaitlistDialog />
				</div>
			</div>
		</section>
	);
}

function HeroBackground() {
	return (
		<div aria-hidden="true" className="pointer-events-none absolute inset-0">
			<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.035)_1px,transparent_1px),linear-gradient(0deg,rgba(17,17,17,0.035)_1px,transparent_1px)] bg-[size:72px_72px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
			<div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[var(--marketing-bg)] to-transparent" />
			<div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[var(--marketing-bg)] via-[var(--marketing-bg)]/85 to-transparent" />
			<div className="absolute left-[-6rem] top-24 h-[520px] w-[520px] rotate-6 border border-[var(--app-border)] bg-[linear-gradient(45deg,rgba(255,90,31,0.14)_25%,transparent_25%,transparent_50%,rgba(255,90,31,0.14)_50%,rgba(255,90,31,0.14)_75%,transparent_75%,transparent)] bg-[size:28px_28px] opacity-55 [mask-image:linear-gradient(90deg,black,transparent_78%)]" />
			<div className="absolute right-[-9rem] top-12 h-[560px] w-[560px] -rotate-6 border border-[var(--app-border)] bg-[linear-gradient(45deg,rgba(17,17,17,0.08)_25%,transparent_25%,transparent_50%,rgba(17,17,17,0.08)_50%,rgba(17,17,17,0.08)_75%,transparent_75%,transparent)] bg-[size:32px_32px] opacity-45 [mask-image:linear-gradient(270deg,black,transparent_76%)] dark:bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)]" />
			<div className="absolute left-1/2 top-16 h-px w-[min(82vw,980px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--app-border)] to-transparent" />
			<div className="absolute bottom-24 left-1/2 h-px w-[min(70vw,760px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
		</div>
	);
}

function WaitlistDialog() {
	const [email, setEmail] = useState("");
	const waitlist = useJoinWaitlist();

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		waitlist.mutate({ email });
	};

	const errorMessage =
		waitlist.error instanceof ApiError
			? waitlist.error.message
			: waitlist.error
				? "Unable to join waitlist"
				: null;

	return (
		<CustomModal
			description="Get early access when Uptions opens."
			title="Join the waitlist"
			trigger={<Button>Join Waitlist</Button>}
		>
			<form className="grid gap-4" onSubmit={handleSubmit}>
				<label className="grid gap-2">
					<span className="text-sm font-medium text-app-fg">Email</span>
					<input
						className="h-11 border border-app-border bg-app-bg px-3 text-sm text-app-fg outline-none transition placeholder:text-app-muted-fg focus:border-primary"
						onChange={(event) => {
							setEmail(event.target.value);
							waitlist.reset();
						}}
						placeholder="you@example.com"
						required
						type="email"
						value={email}
					/>
				</label>
				{errorMessage ? (
					<Typography className="text-danger" variant="caption">
						{errorMessage}
					</Typography>
				) : null}
				{waitlist.isSuccess ? (
					<Typography className="text-success" variant="caption">
						You are on the waitlist.
					</Typography>
				) : null}
				<Button className="h-11" disabled={waitlist.isPending} type="submit">
					{waitlist.isPending ? "Joining..." : "Request Access"}
				</Button>
			</form>
		</CustomModal>
	);
}
