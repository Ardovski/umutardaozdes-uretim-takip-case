import type { Config } from "tailwindcss";

// ÖZEL DESIGN TOKEN'LARI — tüm renkler CSS değişkenlerinden (globals.css).
// Hardcoded renk KULLANMA; her zaman semantic token. Bkz. .docs/web/theme.md
const hsl = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // --- shadcn temel ---
        background: hsl("background"),
        foreground: hsl("foreground"),
        card: { DEFAULT: hsl("card"), foreground: hsl("card-foreground") },
        popover: { DEFAULT: hsl("card"), foreground: hsl("card-foreground") },
        primary: { DEFAULT: hsl("primary"), foreground: hsl("primary-foreground") },
        secondary: { DEFAULT: hsl("secondary"), foreground: hsl("foreground") },
        muted: { DEFAULT: hsl("muted"), foreground: hsl("muted-foreground") },
        accent: { DEFAULT: hsl("accent"), foreground: hsl("foreground") },
        border: hsl("border"),
        input: hsl("input"),
        ring: hsl("ring"),

        // --- DOMAIN SEMANTIC TOKEN'LARI ---
        // validasyon severity
        success: { DEFAULT: hsl("success"), foreground: hsl("success-foreground") },
        warning: { DEFAULT: hsl("warning"), foreground: hsl("warning-foreground") },
        destructive: { DEFAULT: hsl("destructive"), foreground: hsl("destructive-foreground") },
        info: hsl("info"),
        // OEE performans bantları
        oee: { good: hsl("oee-good"), mid: hsl("oee-mid"), low: hsl("oee-low") },
        // vardiya
        shift: { "1": hsl("shift-1"), "2": hsl("shift-2"), "3": hsl("shift-3") },
        // grafik paleti
        chart: {
          "1": hsl("chart-1"),
          "2": hsl("chart-2"),
          "3": hsl("chart-3"),
          "4": hsl("chart-4"),
          "5": hsl("chart-5"),
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
