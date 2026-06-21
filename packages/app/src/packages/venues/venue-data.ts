import { AppKeyword } from "@/common";

export const venueIds = {
	polymarket: "polymarket",
} as const;

export type VenueId = (typeof venueIds)[keyof typeof venueIds];

export type VenueConfig = {
	id: VenueId;
	label: string;
	description: string;
};

export const venues = [
	{
		id: venueIds.polymarket,
		label: AppKeyword.Polymarket,
		description: "Live prediction markets and CLOB execution",
	},
] as const satisfies readonly VenueConfig[];

export const defaultVenueId = venueIds.polymarket;

export function getVenueConfig(venue: VenueId) {
	return venues.find((item) => item.id === venue) ?? venues[0];
}
