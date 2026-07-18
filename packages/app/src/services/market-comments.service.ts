import { API_ROUTES } from "@/constant/api-routes.ts";
import type { ApiResponse } from "@/packages/types/api.types.ts";
import type {
	CreateMarketCommentRequest,
	MarketComment,
	MarketCommentsPage,
} from "@/packages/types/market-comment.types.ts";
import { uptionsRequest } from "@/services/api.service.ts";

const COMMENTS_PAGE_SIZE = 50;

class MarketCommentsService {
	create(marketId: string, payload: CreateMarketCommentRequest) {
		return uptionsRequest.POST<
			ApiResponse<MarketComment>,
			CreateMarketCommentRequest
		>(API_ROUTES.markets.comments(marketId), payload);
	}

	list(marketId: string, before?: string | null) {
		return uptionsRequest.GET<ApiResponse<MarketCommentsPage>>(
			API_ROUTES.markets.comments(marketId),
			{
				query: {
					before,
					limit: COMMENTS_PAGE_SIZE,
				},
			},
		);
	}
}

export const marketCommentsService = new MarketCommentsService();
