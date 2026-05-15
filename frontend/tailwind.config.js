export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#070711",
        ink: "#0c0d18",
        panel: "#121527",
        glass: "rgba(255,255,255,0.08)",
        cyan: "#27f5ff",
        pink: "#ff3edb",
        lime: "#b7ff4d",
        violet: "#8b5cf6"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 42px rgba(39, 245, 255, 0.22)",
        pinkGlow: "0 0 44px rgba(255, 62, 219, 0.25)",
        lift: "0 24px 70px rgba(0, 0, 0, 0.42)"
      },
      animation: {
        shimmer: "shimmer 1.45s infinite linear",
        floaty: "floaty 7s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.8s ease-in-out infinite"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" }
        },
        floaty: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -16px, 0)" }
        },
        pulseGlow: {
          "0%, 100%": { filter: "drop-shadow(0 0 16px rgba(39,245,255,.34))" },
          "50%": { filter: "drop-shadow(0 0 34px rgba(255,62,219,.4))" }
        }
      }
    }
  },
  plugins: []
};
