<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { basicSetup } from "codemirror";

  import { javascript } from "@codemirror/lang-javascript";
  import { oneDark } from "@codemirror/theme-one-dark";

  import { EditorState } from "@codemirror/state";
  import { EditorView } from "@codemirror/view";

  import { createExtension } from "./codemirror";

  // import { createTabList } from "../utils/tabs";
  // import { TabList } from "./TabList";

  let ref: HTMLDivElement | undefined;
  let view: EditorView | undefined;

  onMount(() => {
    view = new EditorView({
      parent: ref,
    });
    

    const themeExt = createExtension(oneDark);
    const basicExt = createExtension(basicSetup);
    const updateExt = createExtension(
      EditorView.updateListener.of((update) => {
        const activeTab = tabs.list[tabs.active];
        if (activeTab.state) {
          setTabState("list", tabs.active, "state", update.state);
        }
      })
    );

    const activeTab = tabs.list[tabs.active];
    if (!activeTab.state) {
      const state = EditorState.create({
        doc: activeTab.value,
        extensions: [
          themeExt.extension,
          basicExt.extension,
          activeTab.lang,
          updateExt.extension,
        ],
      });

      setTabState("list", tabs.active, "state", state);
    }

    if (activeTab.state) {
      view.setState(activeTab.state);
    }
  });

  onDestroy(() => {
    view?.destroy?.();
  });
</script>

<div class="flex flex-col w-full h-full">
  <TabList state={getState()} tabsListState={tabsListState} />
  <div bind:this={ref} />
</div>
