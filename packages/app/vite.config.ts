import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const requiredProductionEnv = [
	"VITE_API_BASE_URL",
	"VITE_ENABLE_WAITLIST",
	"VITE_PUBLIC_SITE_URL",
	"VITE_WALLETCONNECT_PROJECT_ID",
] as const;

const config = defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const apiProxyTarget = env.VITE_API_PROXY_TARGET ?? "http://localhost:3000";

	if (mode === "production") {
		validateProductionEnv(env);
	}

	return {
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
	};
});

function validateProductionEnv(env: Record<string, string>) {
	const missing = requiredProductionEnv.filter((key) => !env[key]?.trim());

	if (missing.length > 0) {
		throw new Error(
			`Missing required production environment variables: ${missing.join(", ")}`,
		);
	}

	if (!isAbsoluteHttpUrl(env.VITE_API_BASE_URL)) {
		throw new Error("VITE_API_BASE_URL must be an absolute HTTP(S) URL");
	}

	if (!isAbsoluteHttpUrl(env.VITE_PUBLIC_SITE_URL)) {
		throw new Error("VITE_PUBLIC_SITE_URL must be an absolute HTTP(S) URL");
	}

	if (!new Set(["true", "false"]).has(env.VITE_ENABLE_WAITLIST)) {
		throw new Error("VITE_ENABLE_WAITLIST must be either true or false");
	}
}

function isAbsoluteHttpUrl(value: string | undefined) {
	if (!value) {
		return false;
	}

	try {
		return ["http:", "https:"].includes(new URL(value).protocol);
	} catch {
		return false;
	}
}

export default config;
