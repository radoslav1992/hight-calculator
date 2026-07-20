import { generateSW } from "workbox-build";

const { count, size, warnings } = await generateSW({
  globDirectory: "dist",
  globPatterns: ["**/*.{css,js,html,svg,png,json,webmanifest,xml,txt}"],
  globIgnores: ["sw.js", "workbox-*.js"],
  swDest: "dist/sw.js",
  navigateFallback: "/offline/index.html",
  navigateFallbackDenylist: [/^\/_astro\//, /\/[^/?]+\.[^/]+$/],
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 2 * 1024 * 1024
});

for (const warning of warnings) console.warn(`[PWA] ${warning}`);
console.log(`[PWA] Generated dist/sw.js with ${count} precached files (${Math.round(size / 1024)} KiB).`);
