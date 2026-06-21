import { type FormEvent, useState } from "react";
import { CustomModal } from "@/components/dialogs/custom-modal.tsx";
import { ApiError } from "@/components/errors/api.error.ts";
import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useJoinWaitlist } from "@/hooks/use-join-waitlist.ts";
import { cn } from "@/lib/utils.ts";
import { AuthPanel } from "./auth-panel.tsx";

type LaunchDialogProps = {
	buttonClassName?: string;
};

export function LaunchDialog({ buttonClassName }: LaunchDialogProps) {
	const params =
		typeof window === "undefined"
			? new URLSearchParams()
			: new URLSearchParams(window.location.search);
	const verificationToken = params.get("verify_email");
	const resetToken = params.get("reset_password");
	const hasAuthToken = Boolean(verificationToken || resetToken);
	const showWaitlist = import.meta.env.PROD && !hasAuthToken;
	const [open, setOpen] = useState(hasAuthToken);

	return (
		<CustomModal
			className="border-white/10 bg-[var(--dashboard-bg)] p-0 text-white"
			onOpenChange={setOpen}
			open={open}
			showHeader={false}
			title={showWaitlist ? "Join Uptions waitlist" : "Uptions account"}
			trigger={
				<Button className={buttonClassName} type="button">
					{showWaitlist ? "Waitinglist" : "Get started"}
				</Button>
			}
		>
			{showWaitlist ? (
				<WaitlistPanel className="border-0" />
			) : (
				<AuthPanel
					className="border-0"
					onAuthenticated={() => setOpen(false)}
					resetToken={resetToken}
					verificationToken={verificationToken}
				/>
			)}
		</CustomModal>
	);
}

type WaitlistPanelProps = {
	className?: string;
};

function WaitlistPanel({ className }: WaitlistPanelProps) {
	const [email, setEmail] = useState("");
	const [notice, setNotice] = useState<string | null>(null);
	const joinWaitlist = useJoinWaitlist();
	const error = getErrorMessage(joinWaitlist.error);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		joinWaitlist.mutate(
			{ email },
			{
				onSuccess: (response) => {
					setNotice(response.message || "You are on the waitlist.");
					setEmail("");
				},
			},
		);
	}

	return (
		<form
			className={cn(
				"grid gap-4 border border-white/10 bg-app-card p-5",
				className,
			)}
			onSubmit={handleSubmit}
		>
			<div>
				<Typography className="text-white" variant="h3">
					Join the waitlist
				</Typography>
				<Typography className="mt-2 text-white/55" variant="bodySm">
					Leave your email and we will let you know when Uptions is ready.
				</Typography>
			</div>
			<label className="grid gap-2">
				<span className="text-xs font-medium text-white/55">Email</span>
				<input
					autoComplete="email"
					className="h-10 border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-white/35"
					onChange={(event) => setEmail(event.target.value)}
					required
					type="email"
					value={email}
				/>
			</label>
			{notice && (
				<Typography className="text-white/70" variant="bodySm">
					{notice}
				</Typography>
			)}
			{error && (
				<Typography className="text-danger" variant="bodySm">
					{error}
				</Typography>
			)}
			<Button
				className="h-10 bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
				disabled={joinWaitlist.isPending}
				type="submit"
			>
				{joinWaitlist.isPending ? "Joining waitlist" : "Join waitlist"}
			</Button>
		</form>
	);
}

function getErrorMessage(error: unknown) {
	if (error instanceof ApiError) {
		return error.message;
	}

	return error instanceof Error ? error.message : null;
}
