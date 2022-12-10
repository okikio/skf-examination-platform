<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { basicSetup } from "codemirror";

  import { tablist, activeTab, activeTabId } from "./state";

  import { javascript } from "@codemirror/lang-javascript";
  import { oneDark } from "@codemirror/theme-one-dark";

  import { EditorState } from "@codemirror/state";
  import { EditorView } from "@codemirror/view";

  import { createExtension } from "./codemirror";

  import Tabs from "./tabs.svelte";

  // import { createTabList } from "../utils/tabs";
  // import { TabList } from "./TabList";

  let ref: HTMLDivElement | undefined;
  let view: EditorView | undefined;

  const themeExt = createExtension(oneDark, view);
  const basicExt = createExtension(basicSetup, view);
  const updateExt = createExtension(
    EditorView.updateListener.of((update) => {
      if ($activeTab.state) {
        $tablist[$activeTabId].state = update.state;
      }
    }),
    view
  );

  $: {
    if (view) {
      if (!$activeTab.state) {
        const state = EditorState.create({
          doc: $activeTab.value,
          extensions: [
            themeExt.extension,
            basicExt.extension,
            $activeTab.lang,
            updateExt.extension,
          ],
        });

        $tablist[$activeTabId].state = state;
      }
      
      if ($activeTab.state) {
        view.setState($activeTab.state);
      }
    }
  }

  onMount(() => {
    view = new EditorView({
      parent: ref,
    });
  });

  onDestroy(() => {
    view?.destroy?.();
  });
</script>

<div class="flex flex-col w-full h-full">
  <Tabs />
  <div bind:this={ref} />
</div>
