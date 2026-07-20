/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      boxShadow: {
        brutal: "6px 6px 0 #171717",
        "brutal-sm": "3px 3px 0 #171717"
      }
    }
  }
};
