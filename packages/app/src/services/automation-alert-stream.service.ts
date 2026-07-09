import { ApiError } from "@/components/errors/api.error.ts";
import { API_ROUTES } from "@/constant/api-routes.ts";
import type { AutomationAlert } from "@/packages/types/automation.types.ts";
import { getAuthToken } from "@/services/auth-token.service.ts";

type AutomationAlertStreamOptions = {
	onAlert: (alert: AutomationAlert) => void;
	signal?: AbortSignal;
};

type SseMessage = {
	data: string;
	event: string;
};

class AutomationAlertStreamService {
	async connect({ onAlert, signal }: AutomationAlertStreamOptions) {
		const token = getAuthToken();

		if (!token) {
			throw new ApiError("Sign in to receive notifications", 401, null);
		}

		const response = await fetch(this.streamUrl(), {
			headers: {
				Accept: "text/event-stream",
				Authorization: `Bearer ${token}`,
			},
			signal,
		});

		if (!response.ok) {
			throw new ApiError(
				response.statusText || "Unable to connect notifications",
				response.status,
				null,
			);
		}

		if (!response.body) {
			throw new Error("Notification stream is unavailable");
		}

		await this.readStream(response.body, onAlert, signal);
	}

	private async readStream(
		body: ReadableStream<Uint8Array>,
		onAlert: (alert: AutomationAlert) => void,
		signal?: AbortSignal,
	) {
		const reader = body.getReader();
		const decoder = new TextDecoder();
		let buffer = "";

		try {
			while (!signal?.aborted) {
				const { done, value } = await reader.read();

				if (done) {
					break;
				}

				buffer += decoder.decode(value, { stream: true });
				const parts = buffer.split(/\r?\n\r?\n/);
				buffer = parts.pop() ?? "";

				for (const part of parts) {
					this.handleMessage(part, onAlert);
				}
			}
		} finally {
			reader.releaseLock();
		}
	}

	private handleMessage(
		raw: string,
		onAlert: (alert: AutomationAlert) => void,
	) {
		const message = this.parseMessage(raw);

		if (!message || message.event !== "automation_alert") {
			return;
		}

		try {
			onAlert(JSON.parse(message.data) as AutomationAlert);
		} catch {
			return;
		}
	}

	private parseMessage(raw: string): SseMessage | null {
		const lines = raw.split(/\r?\n/);
		let event = "message";
		const data: string[] = [];

		for (const line of lines) {
			if (!line || line.startsWith(":")) {
				continue;
			}

			if (line.startsWith("event:")) {
				event = line.slice(6).trim();
				continue;
			}

			if (line.startsWith("data:")) {
				data.push(line.slice(5).trimStart());
			}
		}

		if (data.length === 0) {
			return null;
		}

		return {
			data: data.join("\n"),
			event,
		};
	}

	private streamUrl() {
		const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

		if (baseUrl) {
			return new URL(API_ROUTES.automations.alertStream, baseUrl).toString();
		}

		return API_ROUTES.automations.alertStream;
	}
}

export const automationAlertStreamService = new AutomationAlertStreamService();
