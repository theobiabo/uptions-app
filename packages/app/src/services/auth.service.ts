import { API_ROUTES } from "@/constant/api-routes.ts";
import type { ApiResponse } from "@/packages/types/api.types.ts";
import type {
	AuthSessionResponse,
	AuthUser,
	ConnectPolymarketRequest,
	EmailAuthRequest,
	VenueConnection,
} from "@/packages/types/auth.types.ts";
import { uptionsRequest } from "@/services/api.service.ts";
import { setAuthToken } from "@/services/auth-token.service.ts";

export class AuthService {
	currentUser() {
		return uptionsRequest.GET<ApiResponse<AuthUser>>(API_ROUTES.auth.me);
	}

	async signup(payload: EmailAuthRequest) {
		const response = await uptionsRequest.POST<
			ApiResponse<AuthSessionResponse>,
			EmailAuthRequest
		>(API_ROUTES.auth.signup, payload);

		setAuthToken(response.data.access_token);

		return response.data.user;
	}

	async login(payload: EmailAuthRequest) {
		const response = await uptionsRequest.POST<
			ApiResponse<AuthSessionResponse>,
			EmailAuthRequest
		>(API_ROUTES.auth.login, payload);

		setAuthToken(response.data.access_token);

		return response.data.user;
	}

	connectPolymarket(payload: ConnectPolymarketRequest) {
		return uptionsRequest.POST<
			ApiResponse<VenueConnection>,
			ConnectPolymarketRequest
		>(API_ROUTES.venueConnections.polymarket, payload);
	}
}

export const authService = new AuthService();
