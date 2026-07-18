import {
	BarChart3,
	Bell,
	Hammer,
	Home,
	LineChart,
	ListOrdered,
	Settings,
} from "lucide-react";
import { AppKeyword } from "@/common";

export const dashboardNavigationItems = [
	{ label: "Dashboard", href: "/dashboard", icon: Home },
	{ label: AppKeyword.Markets, href: "/markets", icon: LineChart },
	{ label: "Orders", href: "/orders", icon: ListOrdered },
	{ label: "Analytics", href: "/analytics", icon: BarChart3 },
] as const;

export const dashboardActions = {
	notificationsLabel: "Notifications",
	accountLabel: "Sign in",
	notificationsIcon: Bell,
} as const;
