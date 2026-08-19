// Vendor-free build config — replaces @lovable.dev/vite-tanstack-config so the
// project builds on any host without Lovable's private package.
// Plugin order matters: tsConfigPaths → tailwind → tanstackStart → nitro → react.
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      // Keep routing to src/server.ts (the SSR error wrapper) as before.
      server: { entry: "server" },
    }),
    nitro(),
    viteReact(),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-store"],
  },
});
