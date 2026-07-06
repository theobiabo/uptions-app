export function emptyToUndefined(value: string | undefined) {
	const trimmed = value?.trim();

	return trimmed ? trimmed : undefined;
}

export function parseStringArray(value: string | string[] | undefined) {
	if (Array.isArray(value)) {
		return value;
	}

	if (!value) {
		return [];
	}

	try {
		const parsed = JSON.parse(value);

		return Array.isArray(parsed) ? parsed.map(String) : [];
	} catch {
		return [];
	}
}
