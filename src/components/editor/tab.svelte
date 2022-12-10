<script lang="ts">
  import { addTab, tablist, setActive, activeTabId, removeTab } from "./state";

  // import IconFluentDismiss24Filled from "~icons/fluent/dismiss24-filled";
  // import FluentEmojiAdmissionTickets from "~icons/fluent-emoji/admission-tickets";

  // export interface TabProps {
  //   name?: string;
  //   pinned?: boolean;
  //   index: number;
  //   tabsListState: ReturnType<typeof createTabList>;
  // }

  export let index = 0;
  export let name = "Tab";
</script>

<!-- export function Tab(props: ComponentProps<"div"> & TabProps) {
  const [tabs, { setActive, removeTab }] = props.tabsListState;
  return (
  );
} -->

<button
  class="tab"
  class:active={$activeTabId == index}
  on:click={() => {
    setActive(index);
  }}
>
  <div>
    <!-- <input
          type="text"
          value={props.name}
          onInput={(e) => setTabState("list", props.index, "url", e.currentTarget.value)}
        />  -->
    <!-- <IconFluentEmojiFaceWithTearsOfJoys />  -->
    <!-- <FluentEmojiAdmissionTickets /> -->
    <section class="flex-grow">{name}</section>
    <button
      class="close-tab-btn"
      type="button"
      title="Close"
      on:click={() => {
        removeTab(index);
      }}
    >
      <!-- <IconFluentDismiss24Filled /> -->
      Dismiss
    </button>
  </div>
</button>
