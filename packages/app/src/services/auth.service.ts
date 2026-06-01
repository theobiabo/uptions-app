import { API_ROUTES } from "@/constant/api-routes.ts";
import type { ApiResponse } from "@/packages/types/api.types.ts";
import type {
	AuthUser,
	ConnectPolymarketRequest,
	CreateChallengeRequest,
	CreateChallengeResponse,
	VenueConnection,
	VerifyChallengeRequest,
	VerifyChallengeResponse,
} from "@/packages/types/auth.types.ts";
import { uptionsRequest } from "@/services/api.service.ts";
import { setAuthToken } from "@/services/auth-token.service.ts";

type EthereumProvider = {
	request: <TResult = unknown>(args: {
		method: string;
		params?: unknown[];
	}) => Promise<TResult>;
};

declare global {
	interface Window {
		ethereum?: EthereumProvider;
	}
}

export class AuthService {
	createChallenge(walletAddress: string) {
		return uptionsRequest.POST<
			ApiResponse<CreateChallengeResponse>,
			CreateChallengeRequest
		>(API_ROUTES.auth.challenge, { wallet_address: walletAddress });
	}

	verifyChallenge(walletAddress: string, signature: string) {
		return uptionsRequest.POST<
			ApiResponse<VerifyChallengeResponse>,
			VerifyChallengeRequest
		>(API_ROUTES.auth.verify, {
			signature,
			wallet_address: walletAddress,
		});
	}

	currentUser() {
		return uptionsRequest.GET<ApiResponse<AuthUser>>(API_ROUTES.auth.me);
	}

	connectPolymarket(payload: ConnectPolymarketRequest) {
		return uptionsRequest.POST<
			ApiResponse<VenueConnection>,
			ConnectPolymarketRequest
		>(API_ROUTES.venueConnections.polymarket, payload);
	}

	async loginWithWallet() {
		const provider = window.ethereum;

		if (!provider) {
			throw new Error("No wallet provider found");
		}

		const accounts = await provider.request<string[]>({
			method: "eth_requestAccounts",
		});
		const walletAddress = accounts[0];

		if (!walletAddress) {
			throw new Error("No wallet account selected");
		}

		const challenge = await this.createChallenge(walletAddress);
		const signature = await provider.request<string>({
			method: "personal_sign",
			params: [challenge.data.message, walletAddress],
		});
		const verified = await this.verifyChallenge(walletAddress, signature);

		setAuthToken(verified.data.access_token);

		return verified.data.user;
	}
}

export const authService = new AuthService();
