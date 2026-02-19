import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "#FFFFFF", // Blanc sur Corail
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "#FFFFFF", // Blanc sur Océan
        },
        focus: "hsl(var(--secondary))",
      },
    },
    dark: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "#FFFFFF",
        },
      },
    },
  },
});