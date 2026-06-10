import { useNavigate } from "@tanstack/react-router";
import { KeyRound, LogIn, MailCheck, UserPlus } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { ApiError } from "@/components/errors/api.error.ts";
import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	useEmailLogin,
	useEmailSignup,
	useForgotPassword,
	useResetPassword,
	useVerifyEmail,
} from "@/hooks/use-auth.ts";
import { cn } from "@/lib/utils.ts";
import { AuthMode } from "@/common";

type AuthPanelProps = {
	className?: string;
	onAuthenticated?: () => void;
	resetToken?: string | null;
	verificationToken?: string | null;
};

export function AuthPanel({
	className,
	onAuthenticated,
	resetToken,
	verificationToken,
}: AuthPanelProps) {
	const navigate = useNavigate();
	const [mode, setMode] = useState<AuthMode>(resetToken ? AuthMode.RESET : AuthMode.LOGIN);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [notice, setNotice] = useState<string | null>(null);
	const [verificationAttempted, setVerificationAttempted] = useState(false);
	const login = useEmailLogin();
	const signup = useEmailSignup();
	const forgotPassword = useForgotPassword();
	const resetPassword = useResetPassword();
	const verifyEmail = useVerifyEmail();
	const activeError =
		mode === AuthMode.SIGNUP
			? signup.error
			: mode === AuthMode.FORGOT
				? forgotPassword.error
				: mode === AuthMode.RESET
					? resetPassword.error
					: login.error;
	const isPending =
		login.isPending ||
		signup.isPending ||
		forgotPassword.isPending ||
		resetPassword.isPending ||
		verifyEmail.isPending;
	const error = getErrorMessage(activeError ?? verifyEmail.error);

	useEffect(() => {
		if (!verificationToken || verificationAttempted) {
			return;
		}

		setVerificationAttempted(true);
		verifyEmail.mutate(
			{ token: verificationToken },
			{
				onSuccess: () => {
					onAuthenticated?.();
					navigate({ to: "/dashboard" });
				},
			},
		);
	}, [
		navigate,
		onAuthenticated,
		verificationAttempted,
		verificationToken,
		verifyEmail,
	]);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (mode === AuthMode.SIGNUP) {
			signup.mutate(
				{ email, password },
				{
					onSuccess: () => {
						setNotice(
							"Check your email to verify your account before signing in.",
						);
						setPassword("");
						setMode(AuthMode.LOGIN);
					},
				},
			);
			return;
		}

		if (mode === AuthMode.FORGOT) {
			forgotPassword.mutate(
				{ email },
				{
					onSuccess: () => {
						setNotice("If an account exists, a reset link has been sent.");
						setMode(AuthMode.LOGIN);
					},
				},
			);
			return;
		}

		if (mode === AuthMode.RESET && resetToken) {
			resetPassword.mutate(
				{ password, token: resetToken },
				{
					onSuccess: () => {
						onAuthenticated?.();
						navigate({ to: "/dashboard" });
					},
				},
			);
			return;
		}

		login.mutate(
			{ email, password },
			{
				onSuccess: () => {
					onAuthenticated?.();
					navigate({ to: "/dashboard" });
				},
			},
		);
	}

	const title =
		mode === AuthMode.SIGNUP
			? "Create account"
			: mode === AuthMode.FORGOT
				? "Reset password"
				: mode === AuthMode.RESET
					? "Choose a new password"
					: verificationToken
						? "Verifying account"
						: "Sign in";

	return (
		<form
			className={cn(
				"grid gap-4 border border-white/10 bg-app-card p-5",
				className,
			)}
			onSubmit={handleSubmit}
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<Typography className="text-white" variant="h3">
						{title}
					</Typography>
					<Typography className="mt-2 text-white/55" variant="bodySm">
						{mode === AuthMode.FORGOT
							? "Enter your email and we will send a password reset link."
							: mode === AuthMode.RESET
								? "Enter a new password to finish resetting your account."
								: verificationToken
									? "Please wait while we confirm your email."
									: "Use your Uptions account, then connect prediction market venues separately."}
					</Typography>
				</div>
				<div className="flex border border-white/10">
					<button
						className={cn(
							"h-9 px-3 text-xs font-semibold text-white/60",
							mode === AuthMode.LOGIN && "bg-white text-black",
						)}
						onClick={() => setMode(AuthMode.LOGIN)}
						type="button"
					>
						<LogIn className="size-3.5" />
					</button>
					<button
						className={cn(
							"h-9 px-3 text-xs font-semibold text-white/60",
							mode === AuthMode.SIGNUP && "bg-white text-black",
						)}
						onClick={() => setMode(AuthMode.SIGNUP)}
						type="button"
					>
						<UserPlus className="size-3.5" />
					</button>
				</div>
			</div>
			{mode !== AuthMode.RESET && !verificationToken && (
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
			)}
			{mode !== AuthMode.FORGOT && !verificationToken && (
				<label className="grid gap-2">
					<span className="text-xs font-medium text-white/55">Password</span>
					<input
						autoComplete={
							mode === AuthMode.LOGIN ? "current-password" : "new-password"
						}
						className="h-10 border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-white/35"
						minLength={8}
						onChange={(event) => setPassword(event.target.value)}
						required
						type="password"
						value={password}
					/>
				</label>
			)}
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
			{!verificationToken && (
				<Button
					className="h-10 bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
					disabled={isPending}
					type="submit"
				>
					{buttonLabel(mode, isPending)}
				</Button>
			)}
			{verificationToken && (
				<div className="flex h-10 items-center gap-2 text-sm text-white/65">
					<MailCheck className="size-4 text-primary" />
					{verifyEmail.isError
						? "Verification failed"
						: isPending
							? "Verifying account"
							: "Verification complete"}
				</div>
			)}
			{mode === AuthMode.LOGIN && !verificationToken && (
				<button
					className="inline-flex items-center gap-2 text-left text-xs font-semibold text-white/55 hover:text-white"
					onClick={() => setMode(AuthMode.FORGOT)}
					type="button"
				>
					<KeyRound className="size-3.5" />
					Forgot password?
				</button>
			)}
		</form>
	);
}

function buttonLabel(mode: AuthMode, isPending: boolean) {
	if (isPending) {
		return mode === "signup"
			? "Creating account"
			: mode === "forgot"
				? "Sending link"
				: mode === "reset"
					? "Resetting password"
					: "Signing in";
	}

	return mode === "signup"
		? "Create account"
		: mode === "forgot"
			? "Send reset link"
			: mode === "reset"
				? "Reset password"
				: "Sign in";
}

function getErrorMessage(error: unknown) {
	if (error instanceof ApiError) {
		return error.message;
	}

	return error instanceof Error ? error.message : null;
}
