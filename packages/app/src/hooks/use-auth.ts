import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSignMessage } from "wagmi";
import type {
	ConnectPolymarketRequest,
	EmailAuthRequest,
	ForgotPasswordRequest,
	ResetPasswordRequest,
	SignupRequest,
	UpdateEmailRequest,
	UpdatePasswordRequest,
	UpdateTradingProviderRequest,
	UpdateUsernameRequest,
	UpdateWalletRequest,
	VerifyEmailRequest,
} from "@/packages/types/auth.types.ts";
import { authService } from "@/services/auth.service.ts";
import { clearAuthToken, getAuthToken } from "@/services/auth-token.service.ts";
import { getRequestErrorMessage } from "@/util/errors.ts";

export const authQueryKey = ["auth", "me"] as const;

export function useCurrentUser() {
	const query = useQuery({
		enabled: Boolean(getAuthToken()),
		queryFn: () => authService.currentUser(),
		queryKey: authQueryKey,
	});

	return {
		error: getRequestErrorMessage(query.error, "Authentication request failed"),
		isLoading: query.isLoading,
		refetch: query.refetch,
		user: query.data?.data ?? null,
	};
}

export function useEmailSignup() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: SignupRequest) => authService.signup(payload),
		onSuccess: (user) => {
			queryClient.setQueryData(authQueryKey, {
				data: user,
				message: "Current user fetched successfully",
				status_code: 200,
			});
		},
	});
}

export function useEmailLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: EmailAuthRequest) => authService.login(payload),
		onSuccess: (user) => {
			queryClient.setQueryData(authQueryKey, {
				data: user,
				message: "Current user fetched successfully",
				status_code: 200,
			});
		},
	});
}

export function useVerifyEmail() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: VerifyEmailRequest) =>
			authService.verifyEmail(payload),
		onSuccess: (user) => {
			queryClient.setQueryData(authQueryKey, {
				data: user,
				message: "Current user fetched successfully",
				status_code: 200,
			});
		},
	});
}

export function useForgotPassword() {
	return useMutation({
		mutationFn: (payload: ForgotPasswordRequest) =>
			authService.forgotPassword(payload),
	});
}

export function useResetPassword() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: ResetPasswordRequest) =>
			authService.resetPassword(payload),
		onSuccess: (user) => {
			queryClient.setQueryData(authQueryKey, {
				data: user,
				message: "Current user fetched successfully",
				status_code: 200,
			});
		},
	});
}

export function useTradingProviders() {
	const query = useQuery({
		queryFn: () => authService.listTradingProviders(),
		queryKey: ["trading-providers"],
	});

	return {
		error: getRequestErrorMessage(query.error, "Unable to fetch providers"),
		isLoading: query.isLoading,
		providers: query.data?.data ?? [],
		refetch: query.refetch,
	};
}

export function useUpdateEmail() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateEmailRequest) =>
			authService.updateEmail(payload),
		onSuccess: (response) => {
			queryClient.setQueryData(authQueryKey, response);
		},
	});
}

export function useUpdateUsername() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateUsernameRequest) =>
			authService.updateUsername(payload),
		onSuccess: (response) => {
			queryClient.setQueryData(authQueryKey, response);
		},
	});
}

export function useUpdatePassword() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdatePasswordRequest) =>
			authService.updatePassword(payload),
		onSuccess: () => {
			clearAuthToken();
			queryClient.clear();
			window.location.assign("/");
		},
	});
}

export function useUpdateTradingProvider() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateTradingProviderRequest) =>
			authService.updateTradingProvider(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authQueryKey });
		},
	});
}

export function useUpdateWallet() {
	const queryClient = useQueryClient();
	const { signMessageAsync } = useSignMessage();

	return useMutation({
		mutationFn: async (payload: UpdateWalletRequest) => {
			const challenge = await authService.createWalletChallenge({
				chain_id: payload.chain_id,
				wallet_address: payload.wallet_address,
			});
			const signature = await signMessageAsync({
				message: challenge.data.message,
			});

			return authService.updateWallet({
				...payload,
				nonce: challenge.data.nonce,
				signature,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authQueryKey });
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();

	return () => {
		void authService.logout().finally(() => {
			clearAuthToken();
			queryClient.clear();
		});
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
