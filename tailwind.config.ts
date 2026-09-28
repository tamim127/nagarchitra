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
        background: "#F7F8FA",
        foreground: "#111827",
        primary: {
          DEFAULT: "#0B3D3A",
          dark: "#082C2A",
          light: "#145955",
          50: "#F0F7F6",
          100: "#D6ECE9",
          200: "#B0DCD7",
          600: "#0B3D3A",
          700: "#082F2D",
          800: "#062220",
          900: "#031413",
        },
        accent: {
          DEFAULT: "#F2B84B",
          hover: "#E5A934",
          light: "#FDF5E7",
          50: "#FEF9F0",
          100: "#FDF0D9",
          500: "#F2B84B",
          600: "#D99B26",
        },
        civic: {
          surface: "#FFFFFF",
          border: "#E5E7EB",
          muted: "#6B7280",
          dark: "#1F2937",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
          dark: "#991B1B",
        },
        success: {
          DEFAULT: "#059669",
          light: "#D1FAE5",
          dark: "#065F46",
        },
        warning: {
          DEFAULT: "#D97706",
          light: "#FEF3C7",
        },
        info: {
          DEFAULT: "#2563EB",
          light: "#DBEAFE",
        }
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "var(--font-siliguri)", "Inter", "sans-serif"],
        bangla: ["var(--font-siliguri)", "sans-serif"],
      },
      boxShadow: {
        'civic': '0 4px 20px -2px rgba(11, 61, 58, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'civic-hover': '0 12px 30px -4px rgba(11, 61, 58, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'civic-card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        'civic': '12px',
        'civic-lg': '16px',
        'civic-xl': '24px',
      }
    },
  },
  plugins: [],
};

export default config;
