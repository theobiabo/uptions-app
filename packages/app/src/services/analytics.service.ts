import { API_ROUTES } from "@/constant/api-routes.ts";
import type { AnalyticsOverview } from "@/packages/types/analytics.types.ts";
import type { ApiResponse } from "@/packages/types/api.types.ts";
import { uptionsRequest } from "@/services/api.service.ts";

export class AnalyticsService {
	overview() {
		return uptionsRequest.GET<ApiResponse<AnalyticsOverview>>(
			API_ROUTES.analytics.overview,
		);
	}
}

export const analyticsService = new AnalyticsService();
