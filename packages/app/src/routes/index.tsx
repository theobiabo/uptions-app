import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader } from "@/components/skeleton/loader";

const Homepage = lazy(() => import("@/pages"));

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<Suspense fallback={<Loader />}>
			<Homepage />
		</Suspense>
	);
}
