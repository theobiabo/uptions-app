import { API_ROUTES } from "@/constant/api-routes.ts";
import type { ApiResponse } from "@/packages/types/api.types.ts";
import type {
	AuthSessionResponse,
	AuthUser,
	ConnectPolymarketRequest,
	EmailAuthRequest,
	ForgotPasswordRequest,
	ResetPasswordRequest,
	SettingsUpdateResponse,
	SignupRequest,
	TradingProviderOption,
	UpdateEmailRequest,
	UpdatePasswordRequest,
	UpdateTradingProviderRequest,
	UpdateWalletRequest,
	UserTradingProviderResponse,
	UserWalletResponse,
	VenueConnection,
	VerifyEmailRequest,
} from "@/packages/types/auth.types.ts";
import { uptionsRequest } from "@/services/api.service.ts";
import { setAuthToken } from "@/services/auth-token.service.ts";

export class AuthService {
	currentUser() {
		return uptionsRequest.GET<ApiResponse<AuthUser>>(API_ROUTES.auth.me);
	}

	async signup(payload: SignupRequest) {
		const response = await uptionsRequest.POST<
			ApiResponse<AuthUser>,
			SignupRequest
		>(API_ROUTES.auth.signup, payload);

		return response.data;
	}

	async login(payload: EmailAuthRequest) {
		const response = await uptionsRequest.POST<
			ApiResponse<AuthSessionResponse>,
			EmailAuthRequest
		>(API_ROUTES.auth.login, payload);

		setAuthToken(response.data.access_token);

		return response.data.user;
	}

	async verifyEmail(payload: VerifyEmailRequest) {
		const response = await uptionsRequest.POST<
			ApiResponse<AuthSessionResponse>,
			VerifyEmailRequest
		>(API_ROUTES.auth.verifyEmail, payload);

		setAuthToken(response.data.access_token);

		return response.data.user;
	}

	forgotPassword(payload: ForgotPasswordRequest) {
		return uptionsRequest.POST<ApiResponse<string>, ForgotPasswordRequest>(
			API_ROUTES.auth.forgotPassword,
			payload,
		);
	}

	async resetPassword(payload: ResetPasswordRequest) {
		const response = await uptionsRequest.POST<
			ApiResponse<AuthSessionResponse>,
			ResetPasswordRequest
		>(API_ROUTES.auth.resetPassword, payload);

		setAuthToken(response.data.access_token);

		return response.data.user;
	}

	listTradingProviders() {
		return uptionsRequest.GET<ApiResponse<TradingProviderOption[]>>(
			API_ROUTES.tradingProviders,
		);
	}

	updateEmail(payload: UpdateEmailRequest) {
		return uptionsRequest.PATCH<ApiResponse<AuthUser>, UpdateEmailRequest>(
			API_ROUTES.users.settings.email,
			payload,
		);
	}

	updatePassword(payload: UpdatePasswordRequest) {
		return uptionsRequest.PATCH<
			ApiResponse<SettingsUpdateResponse>,
			UpdatePasswordRequest
		>(API_ROUTES.users.settings.password, payload);
	}

	updateTradingProvider(payload: UpdateTradingProviderRequest) {
		return uptionsRequest.PATCH<
			ApiResponse<UserTradingProviderResponse>,
			UpdateTradingProviderRequest
		>(API_ROUTES.users.tradingProvider, payload);
	}

	updateWallet(payload: UpdateWalletRequest) {
		return uptionsRequest.PATCH<
			ApiResponse<UserWalletResponse>,
			UpdateWalletRequest
		>(API_ROUTES.users.wallet, payload);
	}

	connectPolymarket(payload: ConnectPolymarketRequest) {
		return uptionsRequest.POST<
			ApiResponse<VenueConnection>,
			ConnectPolymarketRequest
		>(API_ROUTES.venueConnections.polymarket, payload);
	}
}

export const authService = new AuthService();
