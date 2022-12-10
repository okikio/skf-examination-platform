<script lang="ts">
  import type { EditorState } from "@codemirror/state";

  import { addTab, tablist, setActive, length } from "./state";
  import { javascript } from "@codemirror/lang-javascript";

  import { createModel } from "./model";
  
  import Tab from "./tab.svelte";

  // import FluentAdd24Regular from "~icons/fluent/add-24-regular";


</script>


<div class="tab-bar">
  <div class="tab-list">
    {#each $tablist as tabvalue, index}
      <Tab 
        {index} 
        name={tabvalue.url.toString()}
      />
    {/each}
  </div>

  <button
    type="button"
    class="add-tab-btn"
    on:click={() => {
      const model = createModel(
        `const x = \`./test${$length + 1}.ts\`;\nconsole.log(x)`,
        javascript({
          jsx: true,
          typescript: true,
        }),
        `./test${$length + 1}.ts`
      );

      addTab(model);
      setActive($length - 1);
    }}
  >
    <!-- <FluentAdd24Regular /> -->
    Add
  </button>
</div>