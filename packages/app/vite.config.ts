import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const apiProxyTarget =
	process.env.VITE_API_PROXY_TARGET ?? "http://localhost:3000";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackStart({
			spa: {
				enabled: true,
				prerender: {
					outputPath: "/index",
				},
			},
		}),
		viteReact(),
	],
	server: {
		proxy: {
			"/api": {
				changeOrigin: true,
				target: apiProxyTarget,
			},
		},
	},
});

export default config;
