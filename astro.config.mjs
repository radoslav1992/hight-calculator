import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const site = process.env.PUBLIC_SITE_URL ?? "https://tallwise.pages.dev";

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  vite: {
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: false,
        includeAssets: ["favicon.svg", "icons/icon-192.png", "icons/icon-512.png"],
        manifest: {
          name: "Tallwise — Child Height Calculator",
          short_name: "Tallwise",
          description:
            "A private, educational adult-height estimator that runs entirely on your device.",
          theme_color: "#171717",
          background_color: "#fffdf5",
          display: "standalone",
          orientation: "portrait-primary",
          start_url: "/",
          scope: "/",
          categories: ["health", "education", "utilities"],
          icons: [
            {
              src: "/icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable"
            },
            {
              src: "/icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ]
        },
        workbox: {
          navigateFallback: "/offline/",
          globPatterns: ["**/*.{css,js,html,svg,png,json,woff2}"],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true
        }
      })
    ]
  }
});
