import {
	BarChart3,
	Bell,
	BookOpen,
	FileText,
	Hammer,
	Home,
	LineChart,
} from "lucide-react";
import { AppKeyword } from "@/common";

export const dashboardNavigationItems = [
	{ label: "Dashboard", href: "/dashboard", icon: Home },
	{ label: AppKeyword.Markets, href: "/markets", icon: LineChart },
	{ label: "Build", href: "/builder", icon: Hammer },
	{ label: "Templates", href: "/dashboard#templates", icon: FileText },
	{ label: "Playbooks", href: "/dashboard#playbooks", icon: BookOpen },
	{ label: "Analytics", href: "/analytics", icon: BarChart3 },
] as const;

export const dashboardActions = {
	notificationsLabel: "Notifications",
	accountLabel: "Sign in",
	notificationsIcon: Bell,
} as const;
