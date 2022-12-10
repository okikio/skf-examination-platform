import { defineConfig } from "astro/config";
// https://astro.build/config
import svelte from "@astrojs/svelte";

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    optimizeDeps: {
      // Add both @codemirror/state and @codemirror/view to included deps for optimization
      include: ["@codemirror/state", "@codemirror/view"]
    },
    plugins: [
      AutoImport({
        resolvers: [
          IconsResolver({
            prefix: "Icon",
            extension: "svelte",
            enabledCollections: ["mdi", "material-symbols", "ic", "fluent-emoji", "fluent"]
          })
        ]
      }),
      Icons({
        // experimental
        autoInstall: true,
        compiler: "svelte"
      })
    ]
  }
});