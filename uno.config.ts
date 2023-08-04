import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno()],
  theme: {
    fontFamily: {
      sans: "var(--font-sans), system-ui, sans-serif",
    },
  },
});
