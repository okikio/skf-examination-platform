<script lang="ts">

import type { EditorState } from "@codemirror/state";

import { javascript } from "@codemirror/lang-javascript";

import { Button } from "./Button";
import { Tab } from "./Tab";

import { createModel } from "./utils/model";

import FluentAdd24Regular from "~icons/fluent/add-24-regular";

import "./TabList.scss";

  state?: EditorState | null;
  tabsListState: ReturnType<typeof createTabList>;

const initialValue = `const x = "Hello There";\nconsole.log(x)`;

export let activeId = 0;
export let activeTab = list[activeId];

$: activeTab = list[activeId];

export let list = [
  createModel(
    initialValue,
    javascript({
      jsx: true,
      typescript: true,
    }),
    "./test.ts"
  ),
];

const addTab = (model: IModel) => setState("list", [...state.list, model]);
const removeTab = (index: number) => {
  return setState("list", [
    ...state.list.slice(0, index),
    ...state.list.slice(index + 1),
  ]);
};
const setActive = (index: number) => setState("active", index);

</script>


<div class="tab-bar">
  <div class="tab-list">
    {tabs.list.map((value, index) => (
      <Tab
        name={value.url.toString()}
        index={index()}
        tabsListState={tabsListState}
      />
    ))}
  </div>

  <button
    type="button"
    class="add-tab-btn"
    onClick={() => {
      const model = createModel(
        `const x = \`./test${list.length + 1}.ts\`;\nconsole.log(x)`,
        javascript({
          jsx: true,
          typescript: true,
        }),
        `./test${list.length + 1}.ts`
      );

      addTab(model);
      setActive(list.length - 1);
    }}
  >
    <FluentAdd24Regular />
  </button>
</div>