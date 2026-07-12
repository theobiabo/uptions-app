import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { ReactNode } from "react";
import { polygon } from "viem/chains";
import { WagmiProvider } from "wagmi";

const walletConnectProjectId =
	import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "uptions-local";

export const walletConfig = getDefaultConfig({
	appName: "Uptions",
	chains: [polygon],
	projectId: walletConnectProjectId,
	ssr: true,
});

export function WalletProvider({ children }: { children: ReactNode }) {
	return (
		<WagmiProvider config={walletConfig}>
			<RainbowKitProvider appInfo={{ appName: "Uptions" }} coolMode>
				{children}
			</RainbowKitProvider>
		</WagmiProvider>
	);
}
