import { defineConfig, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: {
          name: "Lato",
          weights: [400, 500, 700],
        },
      },
    }),
  ],
  theme: {
    animation: {
      keyframes: {
        menu: `{
          0% {
            opacity: 0.7;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }`,
      },
    },
  },
});
