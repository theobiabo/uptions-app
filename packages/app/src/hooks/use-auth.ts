import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/components/errors/api.error.ts";
import type { ConnectPolymarketRequest } from "@/packages/types/auth.types.ts";
import { authService } from "@/services/auth.service.ts";
import { clearAuthToken, getAuthToken } from "@/services/auth-token.service.ts";

export const authQueryKey = ["auth", "me"] as const;

export function useCurrentUser() {
	const query = useQuery({
		enabled: Boolean(getAuthToken()),
		queryFn: () => authService.currentUser(),
		queryKey: authQueryKey,
	});

	return {
		error: getErrorMessage(query.error),
		isLoading: query.isLoading,
		refetch: query.refetch,
		user: query.data?.data ?? null,
	};
}

export function useWalletLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => authService.loginWithWallet(),
		onSuccess: (user) => {
			queryClient.setQueryData(authQueryKey, {
				data: user,
				message: "Current user fetched successfully",
				status_code: 200,
			});
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();

	return () => {
		clearAuthToken();
		queryClient.removeQueries({ queryKey: authQueryKey });
	};
}

export function useConnectPolymarket() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: ConnectPolymarketRequest) =>
			authService.connectPolymarket(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authQueryKey });
		},
	});
}

function getErrorMessage(error: unknown) {
	if (error instanceof ApiError) {
		return error.message;
	}

	return error ? "Authentication request failed" : null;
}
