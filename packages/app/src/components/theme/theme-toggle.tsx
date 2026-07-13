import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useTheme } from "./theme-provider.tsx";

type ThemeToggleProps = {
	presentation?: "icon" | "menu";
};

export function ThemeToggle({ presentation = "icon" }: ThemeToggleProps) {
	const { theme, toggleTheme } = useTheme();
	const Icon = theme === "dark" ? Sun : Moon;
	const label = theme === "dark" ? "Light mode" : "Dark mode";

	if (presentation === "menu") {
		return (
			<button
				aria-label="Toggle color mode"
				className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs font-medium text-app-muted-fg transition hover:bg-app-muted hover:text-app-fg"
				onClick={toggleTheme}
				type="button"
			>
				<Icon className="size-4" />
				{label}
			</button>
		);
	}

	return (
		<Button
			aria-label="Toggle color mode"
			className="size-9 border-0 bg-transparent text-[var(--app-fg)] hover:bg-[var(--app-muted)]"
			onClick={toggleTheme}
			size="icon"
			type="button"
			variant="ghost"
		>
			<Icon className="size-4 text-app-fg" />
		</Button>
	);
}
