export type Theme = "dark" | "light";

export function getInitialTheme(): Theme {
	if (typeof window === "undefined") {
		return "dark";
	}

	const storedTheme = window.localStorage.getItem("uptions-theme");

	if (storedTheme === "light" || storedTheme === "dark") {
		return storedTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}
