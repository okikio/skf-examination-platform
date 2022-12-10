import { derived, writable } from 'svelte/store';

import { javascript } from "@codemirror/lang-javascript";
import { createModel, type IModel } from "./model";

export const initialValue = `const x = "Hello There";\nconsole.log(x)`;

export const tablist = writable([
  createModel(
    initialValue,
    javascript({
      jsx: true,
      typescript: true,
    }),
    "./test.ts"
  )
]);

export let activeTabId = writable(0);
export let activeTab = derived([tablist, activeTabId], ([$tablist, $activeId]) => $tablist[$activeId]);
export let length = derived(tablist, ($tablist) => $tablist.length);

export const addTab = (model: IModel) => tablist.update(n => {
  n.push(model);
  return n;
});

export const removeTab = (index: number) => {
  return tablist.update(n => {
    n.splice(index, 1);
    return n;
    // return [
    //   ...n.slice(0, index),
    //   ...n.slice(index + 1),
    // ]
  });
};

export const setActive = (index: number) => activeTabId.set(index);