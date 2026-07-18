import { API_ROUTES } from "@/constant/api-routes.ts";
import type { ApiResponse } from "@/packages/types/api.types.ts";
import type { MarketFavorite } from "@/packages/types/market-favorite.types.ts";
import { uptionsRequest } from "@/services/api.service.ts";

class MarketFavoriteService {
	get(marketId: string) {
		return uptionsRequest.GET<ApiResponse<MarketFavorite>>(
			API_ROUTES.markets.favorite(marketId),
		);
	}

	favorite(marketId: string) {
		return uptionsRequest.PUT<ApiResponse<MarketFavorite>>(
			API_ROUTES.markets.favorite(marketId),
		);
	}

	unfavorite(marketId: string) {
		return uptionsRequest.DELETE<ApiResponse<MarketFavorite>>(
			API_ROUTES.markets.favorite(marketId),
		);
	}
}

export const marketFavoriteService = new MarketFavoriteService();
