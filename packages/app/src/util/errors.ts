import { ApiError } from "@/components/errors/api.error.ts";

export function getRequestErrorMessage(
	error: unknown,
	fallbackMessage?: string,
) {
	if (error instanceof ApiError) {
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return error ? (fallbackMessage ?? "Request failed") : null;
}
