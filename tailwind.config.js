/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./public/**/*.svg"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        heading: ["var(--font-jetbrains-mono)", "monospace"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        code: ["var(--font-jetbrains-mono)", "monospace"],
      },
      typography: {
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  safelist: ['glass-card', 'glass-panel'], // Ensure these serve as utilities if dynamically used, though usually not needed if class names are static.
};
