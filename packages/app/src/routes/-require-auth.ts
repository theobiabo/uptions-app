import { redirect } from "@tanstack/react-router";
import { getAuthToken } from "@/services/auth-token.service.ts";

export function requireAuth() {
	if (!getAuthToken()) {
		throw redirect({ to: "/" });
	}
}
