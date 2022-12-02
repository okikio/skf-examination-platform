import type { ComponentProps } from "solid-js";
import { createEffect, splitProps, on } from "solid-js";

import type { CodeMirrorProps } from "./utils/codemirror";
import { createCodeMirror } from "./utils/codemirror";

import { basicSetup, EditorView } from "codemirror";

import { TabList } from "./TabList";

import { mergeRefs } from "@solid-primitives/refs";

import { createTabList } from "./utils/tabs";

// import {
//   githubDark,
//   config,
// } from "@ddietr/codemirror-themes/theme/github-dark.js";

import { EditorState } from "@codemirror/state";

import "./Editor.scss";

// import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const config = {
    name: 'githubDark',
    dark: true,
    background: '#24292e',
    foreground: '#d1d5da',
    selection: '#3392FF44',
    cursor: '#c8e1ff',
    dropdownBackground: '#24292e',
    dropdownBorder: '#1b1f23',
    activeLine: '#2b3036',
    matchingBracket: '#17E5E650',
    keyword: '#f97583',
    storage: '#f97583',
    variable: '#ffab70',
    parameter: '#e1e4e8',
    function: '#79b8ff',
    string: '#9ecbff',
    constant: '#79b8ff',
    type: '#79b8ff',
    class: '#b392f0',
    number: '#79b8ff',
    comment: '#6a737d',
    heading: '#79b8ff',
    invalid: '#f97583',
    regexp: '#9ecbff',
};
const githubDarkTheme = EditorView.theme({
    '&': {
        color: config.foreground,
        backgroundColor: config.background,
    },
    '.cm-content': { caretColor: config.cursor },
    '&.cm-focused .cm-cursor': { borderLeftColor: config.cursor },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, & ::selection': { backgroundColor: config.selection },
    '.cm-panels': { backgroundColor: config.dropdownBackground, color: config.foreground },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
        backgroundColor: config.dropdownBackground,
        outline: `1px solid ${config.dropdownBorder}`
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
        backgroundColor: config.selection
    },
    '.cm-activeLine': { backgroundColor: config.activeLine },
    '.cm-selectionMatch': { backgroundColor: config.selection },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
        backgroundColor: config.matchingBracket,
        outline: 'none'
    },
    '.cm-gutters': {
        backgroundColor: config.background,
        color: config.foreground,
        border: 'none'
    },
    '.cm-activeLineGutter': { backgroundColor: config.background },
    '.cm-foldPlaceholder': {
        backgroundColor: 'transparent',
        border: 'none',
        color: config.foreground
    },
    '.cm-tooltip': {
        border: `1px solid ${config.dropdownBorder}`,
        backgroundColor: config.dropdownBackground,
        color: config.foreground
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
        borderTopColor: config.foreground,
        borderBottomColor: config.foreground,
    },
    '.cm-tooltip.cm-tooltip-autocomplete': {
        '& > ul > li[aria-selected]': {
            background: config.selection,
            color: config.foreground
        }
    },
}, { dark: config.dark });
const githubDarkHighlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: config.keyword },
    { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: config.variable },
    { tag: [tags.propertyName], color: config.function },
    { tag: [tags.processingInstruction, tags.string, tags.inserted, tags.special(tags.string)], color: config.string },
    { tag: [tags.function(tags.variableName), tags.labelName], color: config.function },
    { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: config.constant },
    { tag: [tags.definition(tags.name), tags.separator], color: config.variable },
    { tag: [tags.className], color: config.class },
    { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: config.number },
    { tag: [tags.typeName], color: config.type, fontStyle: config.type },
    { tag: [tags.operator, tags.operatorKeyword], color: config.keyword },
    { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: config.regexp },
    { tag: [tags.meta, tags.comment], color: config.comment },
    { tag: tags.strong, fontWeight: 'bold' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.link, textDecoration: 'underline' },
    { tag: tags.heading, fontWeight: 'bold', color: config.heading },
    { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: config.variable },
    { tag: tags.invalid, color: config.invalid },
    { tag: tags.strikethrough, textDecoration: 'line-through' },
]);
const githubDark = [
    githubDarkTheme,
    syntaxHighlighting(githubDarkHighlightStyle),
];

export { config, githubDark, githubDarkHighlightStyle, githubDarkTheme };


export function Editor(props: ComponentProps<"div"> & CodeMirrorProps) {
  let ref: HTMLDivElement | undefined;
  const [codemirrorProps, others] = splitProps(props, [
    "value",
    "onValueChange",
    "onEditorMount",
  ]);

  const tabsListState = createTabList({
    initialValue: props.value,
  });
  const [tabs, { setState: setTabState }] = tabsListState;

  const { createExtension, getState, getView } = createCodeMirror(
    codemirrorProps,
    () => ref
  );

  const themeExt = createExtension(githubDark);
  const basicExt = createExtension(basicSetup);
  const updateExt = createExtension(
    EditorView.updateListener.of((update) => {
      const activeTab = tabs.list[tabs.active];
      if (activeTab.state) {
        setTabState("list", tabs.active, "state", update.state);
      }
    })
  );

  createEffect(
    on(
      () => tabs.active,
      () => {
        const view = getView();
        if (!view) return;

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
      }
    )
  );

  return (
    <div class="flex flex-col w-full h-full">
      <TabList state={getState()} tabsListState={tabsListState} />
      <div
        class={`w-full h-full overflow-auto`}
        style={{
          "background-color": config.background,
        }}
        ref={mergeRefs((el) => (ref = el), props.ref)}
        {...others}
      />
    </div>
  );
}
