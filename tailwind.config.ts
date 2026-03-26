import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-navy": "#2B456B",
        "brand-blue": "#0080FF",
        "brand-indigo": "#3E4FEA",
        "brand-green": "#067647",
        "brand-orange": "#F08700",
        "brand-gray-100": "#F5F8FA",
        "brand-gray-200": "#E9EAEB",
        "brand-gray-400": "#ABABAB",
        "brand-gray-600": "#8C8C8C",
        "brand-white": "#FFFFFF",
      },
      borderRadius: {
        card: "20px",
        pill: "100px",
        btn: "30px",
      },
      fontFamily: {
        sans: ["var(--font-euclid-circular-b)", "Euclid Circular B", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
