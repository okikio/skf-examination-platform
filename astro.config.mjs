import { defineConfig } from "astro/config";

// https://astro.build/config
// import node from "@astrojs/node";
import svelte from "@astrojs/svelte";
import solidjs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";

// https://astro.build/config
// import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    solidjs(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
  ],
  output: "server",
  adapter: netlify({
    dist: new URL("./dist/", import.meta.url),
  }),
  vite: {
    // build: {
    //   rollupOptions: { external: ["@ddietr/codemirror-themes"] }
    // },
    optimizeDeps: {
      // Add both @codemirror/state and @codemirror/view to included deps for optimization
      include: [
        "@codemirror/state",
        "@codemirror/view",
        "@ddietr/codemirror-themes",
        "@codemirror/language",
        "@lezer/highlight",
      ],
    },
    plugins: [
      AutoImport({
        resolvers: [
          IconsResolver({
            prefix: "Icon",
            extension: "jsx",
            enabledCollections: [
              "mdi",
              "material-symbols",
              "ic",
              "fluent-emoji",
              "fluent",
            ],
          }),
        ],
      }),
      Icons({
        // experimental
        autoInstall: true,
        compiler: "solid",
      }),
    ],
  },
});
