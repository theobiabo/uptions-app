import { Link } from "@tanstack/react-router";

import { useTheme } from "@/components/theme/theme-provider.tsx";

type LogoProps = {
	asLink?: boolean;
};

function Logo({ asLink = true }: LogoProps) {
	const { theme } = useTheme();
	const logoSrc =
		theme === "light" ? "/assets/logo/icon_orange.png" : "/assets/logo/icon.png";
	const mark = (
    <div className="logo flex h-[22px] w-[80px] cursor-pointer items-center">

			<img
				alt="Uptions Logo"

				// height={30}
				src={logoSrc}
				width={40}
			/>
		</div>
	);

	if (!asLink) {
		return mark;
	}

	return (
		<Link className="flex items-center gap-2" to="/dashboard">
			{mark}
		</Link>
	);
}

export default Logo;
