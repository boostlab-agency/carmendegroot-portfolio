import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/**
 * Design tokens live as CSS custom properties in src/app/globals.css.
 * Tailwind only maps semantic names onto those tokens, so the whole
 * identity can be re-tuned from one place.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        "paper-2": "rgb(var(--paper-2) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        graphite: "rgb(var(--graphite) / <alpha-value>)",
        stone: "rgb(var(--stone) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-ink": "rgb(var(--accent-ink) / <alpha-value>)",
        moss: "rgb(var(--moss) / <alpha-value>)",
        clay: "rgb(var(--clay) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        // Fluid display scale
        "display-2xl": ["clamp(3.25rem, 9.2vw, 9.5rem)", { lineHeight: "0.92", letterSpacing: "-0.045em" }],
        "display-xl": ["clamp(2.75rem, 6.6vw, 6.75rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.25rem, 4.8vw, 4.75rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(1.875rem, 3.4vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-sm": ["clamp(1.5rem, 2.4vw, 2.25rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        lead: ["clamp(1.125rem, 1.5vw, 1.375rem)", { lineHeight: "1.55", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        site: "var(--max-site)",
        prose: "68ch",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        rise: {
          from: { opacity: "0.01", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "band-in": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        "pulse-dot": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(var(--accent) / 0.8)" },
          "50%": { boxShadow: "0 0 0 6px rgb(var(--accent) / 0)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        rise: "rise 1.1s cubic-bezier(0.16, 1, 0.3, 1) both",
        "band-in": "band-in 1.2s cubic-bezier(0.76, 0, 0.24, 1) both",
        "pulse-dot": "pulse-dot 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [typography],
};

export default config;
