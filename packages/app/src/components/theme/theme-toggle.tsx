import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useTheme } from "./theme-provider.tsx";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const Icon = theme === "dark" ? Sun : Moon;

	return (
		<Button
			aria-label="Toggle color mode"
			className="size-9  border-0 bg-transparent text-[var(--app-fg)] hover:bg-[var(--app-muted)]"
			onClick={toggleTheme}
			size="icon"
			type="button"
			variant="ghost"
		>
			<Icon className="size-4 text-app-fg" />
		</Button>
	);
}
