export function getFiniteNumber(value: number | string | undefined) {
	const numberValue =
		typeof value === "string" ? Number.parseFloat(value) : value;

	return typeof numberValue === "number" && Number.isFinite(numberValue)
		? numberValue
		: null;
}

export function buildMarketChartPoints(basePrice: number) {
	const clamped = Math.min(Math.max(basePrice, 0.05), 0.95);

	return Array.from({ length: 12 }).map((_, index) => {
		const x = (index / 11) * 900;
		const wave = Math.sin(index * 0.85) * 36 + Math.cos(index * 0.35) * 24;
		const y = 250 - clamped * 120 + wave;

		return { x, y: Math.min(Math.max(y, 45), 260) };
	});
}
