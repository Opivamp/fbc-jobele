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
        burgundy: {
          50: "#FBF2F4",
          100: "#F6E3E7",
          200: "#ECC5CD",
          300: "#DF9EB0",
          400: "#C75F79",
          500: "#A62B4A",
          600: "#841C31",
          700: "#6D1829", // Primary reference maroon/burgundy
          800: "#54111E",
          900: "#3F0B15",
          950: "#26050C",
        },
        navy: {
          50: "#F0F5FA",
          100: "#E1EDF6",
          200: "#C2DAED",
          300: "#94BEDE",
          400: "#5D9ACB",
          500: "#3577B3",
          600: "#1F5B96",
          700: "#14467C",
          800: "#0D3156", // Baptist Royal Navy reference
          900: "#08203B",
          950: "#041121",
        },
        gold: {
          50: "#FCF9F1",
          100: "#F8F2DF",
          200: "#EFE3BD",
          300: "#E4CF94",
          400: "#D7B767",
          500: "#C69234", // Regal Ochre & Trim Gold reference
          600: "#A87522",
          700: "#82571A",
          800: "#634017",
          900: "#4C3114",
        },
        crimson: {
          500: "#D93844",
          600: "#B52B35", // Christian Cross crimson
          700: "#941E27",
        },
        sanctuary: {
          50: "#F2F8F2",
          100: "#E3F2E3",
          500: "#3B8E32",
          600: "#2E7D32", // Living Sanctuary green reference
          700: "#246627",
          800: "#1B4E1E",
        },
        ivory: {
          50: "#FFFFFF",
          100: "#FDFCF9",
          200: "#F7F4EE",
          300: "#ECE6DA",
          400: "#DCD2C0",
        },
        obsidian: {
          700: "#343840",
          800: "#24272D",
          900: "#16181C",
          950: "#0E1012",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 8px -2px rgba(109, 24, 41, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        card: "0 10px 25px -5px rgba(109, 24, 41, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        elevated: "0 20px 35px -10px rgba(13, 49, 86, 0.12), 0 10px 15px -5px rgba(0, 0, 0, 0.04)",
        glow: "0 0 25px rgba(198, 146, 52, 0.25)",
        goldGlow: "0 0 35px rgba(198, 146, 52, 0.35)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        soundwave: {
          "0%, 100%": { height: "4px" },
          "50%": { height: "24px" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.05)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        soundwave: "soundwave 1.2s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
