import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getInitialTheme, type Theme } from "@/util/theme.ts";

type ThemeContextValue = {
	theme: Theme;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const storageKey = "uptions-theme";
const themeTransitionClass = "theme-transitioning";
const themeTransitionDuration = 260;

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		document.documentElement.dataset.theme = theme;
		window.localStorage.setItem(storageKey, theme);
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			toggleTheme: () => {
				document.documentElement.classList.add(themeTransitionClass);
				window.setTimeout(() => {
					document.documentElement.classList.remove(themeTransitionClass);
				}, themeTransitionDuration);

				setTheme((currentTheme) =>
					currentTheme === "dark" ? "light" : "dark",
				);
			},
		}),
		[theme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const theme = useContext(ThemeContext);

	if (!theme) {
		throw new Error("useTheme must be used within ThemeProvider");
	}

	return theme;
}
