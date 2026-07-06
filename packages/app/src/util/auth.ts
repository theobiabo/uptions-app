import { AuthMode } from "@/common";

export function getAuthFormButtonLabel(mode: AuthMode, isPending: boolean) {
	if (isPending) {
		return mode === AuthMode.SIGNUP
			? "Creating account"
			: mode === AuthMode.FORGOT
				? "Sending link"
				: mode === AuthMode.RESET
					? "Resetting password"
					: "Signing in";
	}

	return mode === AuthMode.SIGNUP
		? "Create account"
		: mode === AuthMode.FORGOT
			? "Send reset link"
			: mode === AuthMode.RESET
				? "Reset password"
				: "Sign in";
}
