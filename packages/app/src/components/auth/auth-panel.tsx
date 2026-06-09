import { LogIn, UserPlus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { ApiError } from "@/components/errors/api.error.ts";
import { Typography } from "@/components/typography/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useEmailLogin, useEmailSignup } from "@/hooks/use-auth.ts";
import { cn } from "@/lib/utils.ts";

type AuthMode = "login" | "signup";

type AuthPanelProps = {
	className?: string;
	onAuthenticated?: () => void;
};

export function AuthPanel({ className, onAuthenticated }: AuthPanelProps) {
	const [mode, setMode] = useState<AuthMode>("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const login = useEmailLogin();
	const signup = useEmailSignup();
	const mutation = mode === "login" ? login : signup;
	const isPending = login.isPending || signup.isPending;
	const error = getErrorMessage(mutation.error);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		mutation.mutate(
			{
				email,
				password,
			},
			{
				onSuccess: onAuthenticated,
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
			<div className="flex items-start justify-between gap-4">
				<div>
					<Typography className="text-white" variant="h3">
						{mode === "login" ? "Sign in" : "Create account"}
					</Typography>
					<Typography className="mt-2 text-white/55" variant="bodySm">
						Use your Uptions account, then connect prediction market venues
						separately.
					</Typography>
				</div>
				<div className="flex border border-white/10">
					<button
						className={cn(
							"h-9 px-3 text-xs font-semibold text-white/60",
							mode === "login" && "bg-white text-black",
						)}
						onClick={() => setMode("login")}
						type="button"
					>
						<LogIn className="size-3.5" />
					</button>
					<button
						className={cn(
							"h-9 px-3 text-xs font-semibold text-white/60",
							mode === "signup" && "bg-white text-black",
						)}
						onClick={() => setMode("signup")}
						type="button"
					>
						<UserPlus className="size-3.5" />
					</button>
				</div>
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
			<label className="grid gap-2">
				<span className="text-xs font-medium text-white/55">Password</span>
				<input
					autoComplete={mode === "login" ? "current-password" : "new-password"}
					className="h-10 border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-white/35"
					minLength={8}
					onChange={(event) => setPassword(event.target.value)}
					required
					type="password"
					value={password}
				/>
			</label>
			{error && (
				<Typography className="text-danger" variant="bodySm">
					{error}
				</Typography>
			)}
			<Button
				className="h-10 bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
				disabled={isPending}
				type="submit"
			>
				{isPending
					? mode === "login"
						? "Signing in"
						: "Creating account"
					: mode === "login"
						? "Sign in"
						: "Create account"}
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
