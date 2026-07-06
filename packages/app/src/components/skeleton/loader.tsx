import Logo from "@/components/misc/logo";

export function Loader() {
	return (
		<div className="fixed top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-accent">
			<div className="animate-pulse">
				<Logo />
			</div>
		</div>
	);
}
