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
		<section className="border-[var(--app-border)] h-full mt-[3rem] bg-[var(--app-surface)]">
			<div className="mx-auto flex min-h-[490px] max-w-[1040px] flex-col items-center justify-center px-6 py-20 text-center">
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
