import * as adapter from "@astrojs/netlify/netlify-functions.js";
import { escape as escape$2 } from "html-escaper";
/* empty css                                 */ import { createServerSupabaseClient as createServerSupabaseClient$1 } from "@supabase/auth-helpers-shared";
/* empty css                                     */ import { createClient } from "@supabase/supabase-js";
/* empty css                                              */ /* empty css                                     */ import "chart.js/auto";
/* empty css                                    */ /* empty css                                    */ /* empty css                                   */ /* empty css                                */ /* empty css                                 */ /* empty css                                 */ /* empty css                               */ import { marked } from "marked";
import { Compartment, EditorState } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import clsx from "clsx";
import {
  githubDark,
  config,
} from "@ddietr/codemirror-themes/theme/github-dark";
import "mime";
import "cookie";
import "kleur/colors";
import "string-width";
import "path-browserify";
import { compile } from "path-to-regexp";

function createSignal(value, options) {
  return [
    () => value,
    (v) => {
      return (value = typeof v === "function" ? v(value) : v);
    },
  ];
}
function createEffect(fn, value) {}
function on(deps, fn, options = {}) {
  const isArray = Array.isArray(deps);
  const defer = options.defer;
  return () => {
    if (defer) return undefined;
    let value;
    if (isArray) {
      value = [];
      for (let i = 0; i < deps.length; i++) value.push(deps[i]());
    } else value = deps();
    return fn(value);
  };
}
const sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}
function nextHydrateContext() {
  return sharedConfig.context
    ? {
        ...sharedConfig.context,
        id: `${sharedConfig.context.id}${sharedConfig.context.count++}-`,
        count: 0,
      }
    : undefined;
}
function createComponent$1(Comp, props) {
  if (sharedConfig.context && !sharedConfig.context.noHydrate) {
    const c = sharedConfig.context;
    setHydrateContext(nextHydrateContext());
    const r = Comp(props || {});
    setHydrateContext(c);
    return r;
  }
  return Comp(props || {});
}
function splitProps(props, ...keys) {
  const descriptors = Object.getOwnPropertyDescriptors(props),
    split = (k) => {
      const clone = {};
      for (let i = 0; i < k.length; i++) {
        const key = k[i];
        if (descriptors[key]) {
          Object.defineProperty(clone, key, descriptors[key]);
          delete descriptors[key];
        }
      }
      return clone;
    };
  return keys.map(split).concat(split(Object.keys(descriptors)));
}
function simpleMap(props, wrap) {
  const list = props.each || [],
    len = list.length,
    fn = props.children;
  if (len) {
    let mapped = Array(len);
    for (let i = 0; i < len; i++) mapped[i] = wrap(fn, list[i], i);
    return mapped;
  }
  return props.fallback;
}
function For(props) {
  return simpleMap(props, (fn, item, i) => fn(item, () => i));
}

const booleans = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
];
const BooleanAttributes = /*#__PURE__*/ new Set(booleans);
/*#__PURE__*/ new Set([
  "className",
  "value",
  "readOnly",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  ...booleans,
]);
const ChildProperties = /*#__PURE__*/ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children",
]);
const Aliases = /*#__PURE__*/ Object.assign(Object.create(null), {
  className: "class",
  htmlFor: "for",
});

const { hasOwnProperty } = Object.prototype;
const REF_START_CHARS = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
const REF_START_CHARS_LEN = REF_START_CHARS.length;
const REF_CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
const REF_CHARS_LEN = REF_CHARS.length;
const STACK = [];
const BUFFER = [""];
let ASSIGNMENTS = new Map();
let INDEX_OR_REF = new WeakMap();
let REF_COUNT = 0;
BUFFER.pop();
function stringify(root) {
  if (writeProp(root, "")) {
    let result = BUFFER[0];
    for (let i = 1, len = BUFFER.length; i < len; i++) {
      result += BUFFER[i];
    }
    if (REF_COUNT) {
      if (ASSIGNMENTS.size) {
        let ref = INDEX_OR_REF.get(root);
        if (typeof ref === "number") {
          ref = toRefParam(REF_COUNT++);
          result = ref + "=" + result;
        }
        for (const [assignmentRef, assignments] of ASSIGNMENTS) {
          result += ";" + assignments + assignmentRef;
        }
        result += ";return " + ref;
        ASSIGNMENTS = new Map();
      } else {
        result = "return " + result;
      }
      result = "(function(" + refParamsString() + "){" + result + "}())";
    } else if (root && root.constructor === Object) {
      result = "(" + result + ")";
    }
    BUFFER.length = 0;
    INDEX_OR_REF = new WeakMap();
    return result;
  }
  return "void 0";
}
function writeProp(cur, accessor) {
  switch (typeof cur) {
    case "string":
      BUFFER.push(quote(cur, 0));
      break;
    case "number":
      BUFFER.push(cur + "");
      break;
    case "boolean":
      BUFFER.push(cur ? "!0" : "!1");
      break;
    case "object":
      if (cur === null) {
        BUFFER.push("null");
      } else {
        const ref = getRef(cur, accessor);
        switch (ref) {
          case true:
            return false;
          case false:
            switch (cur.constructor) {
              case Object:
                writeObject(cur);
                break;
              case Array:
                writeArray(cur);
                break;
              case Date:
                BUFFER.push('new Date("' + cur.toISOString() + '")');
                break;
              case RegExp:
                BUFFER.push(cur + "");
                break;
              case Map:
                BUFFER.push("new Map(");
                writeArray(Array.from(cur));
                BUFFER.push(")");
                break;
              case Set:
                BUFFER.push("new Set(");
                writeArray(Array.from(cur));
                BUFFER.push(")");
                break;
              case undefined:
                BUFFER.push("Object.assign(Object.create(null),");
                writeObject(cur);
                BUFFER.push(")");
                break;
              default:
                return false;
            }
            break;
          default:
            BUFFER.push(ref);
            break;
        }
      }
      break;
    default:
      return false;
  }
  return true;
}
function writeObject(obj) {
  let sep = "{";
  STACK.push(obj);
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      const escapedKey = toObjectKey(key);
      BUFFER.push(sep + escapedKey + ":");
      if (writeProp(val, escapedKey)) {
        sep = ",";
      } else {
        BUFFER.pop();
      }
    }
  }
  if (sep === "{") {
    BUFFER.push("{}");
  } else {
    BUFFER.push("}");
  }
  STACK.pop();
}
function writeArray(arr) {
  BUFFER.push("[");
  STACK.push(arr);
  writeProp(arr[0], 0);
  for (let i = 1, len = arr.length; i < len; i++) {
    BUFFER.push(",");
    writeProp(arr[i], i);
  }
  STACK.pop();
  BUFFER.push("]");
}
function getRef(cur, accessor) {
  let ref = INDEX_OR_REF.get(cur);
  if (ref === undefined) {
    INDEX_OR_REF.set(cur, BUFFER.length);
    return false;
  }
  if (typeof ref === "number") {
    ref = insertAndGetRef(cur, ref);
  }
  if (STACK.includes(cur)) {
    const parent = STACK[STACK.length - 1];
    let parentRef = INDEX_OR_REF.get(parent);
    if (typeof parentRef === "number") {
      parentRef = insertAndGetRef(parent, parentRef);
    }
    ASSIGNMENTS.set(
      ref,
      (ASSIGNMENTS.get(ref) || "") + toAssignment(parentRef, accessor) + "="
    );
    return true;
  }
  return ref;
}
function toObjectKey(name) {
  const invalidIdentifierPos = getInvalidIdentifierPos(name);
  return invalidIdentifierPos === -1 ? name : quote(name, invalidIdentifierPos);
}
function toAssignment(parent, key) {
  return (
    parent +
    (typeof key === "number" || key[0] === '"' ? "[" + key + "]" : "." + key)
  );
}
function getInvalidIdentifierPos(name) {
  let char = name[0];
  if (
    !(
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "$" ||
      char === "_"
    )
  ) {
    return 0;
  }
  for (let i = 1, len = name.length; i < len; i++) {
    char = name[i];
    if (
      !(
        (char >= "a" && char <= "z") ||
        (char >= "A" && char <= "Z") ||
        (char >= "0" && char <= "9") ||
        char === "$" ||
        char === "_"
      )
    ) {
      return i;
    }
  }
  return -1;
}
function quote(str, startPos) {
  let result = "";
  let lastPos = 0;
  for (let i = startPos, len = str.length; i < len; i++) {
    let replacement;
    switch (str[i]) {
      case '"':
        replacement = '\\"';
        break;
      case "\\":
        replacement = "\\\\";
        break;
      case "<":
        replacement = "\\x3C";
        break;
      case "\n":
        replacement = "\\n";
        break;
      case "\r":
        replacement = "\\r";
        break;
      case "\u2028":
        replacement = "\\u2028";
        break;
      case "\u2029":
        replacement = "\\u2029";
        break;
      default:
        continue;
    }
    result += str.slice(lastPos, i) + replacement;
    lastPos = i + 1;
  }
  if (lastPos === startPos) {
    result = str;
  } else {
    result += str.slice(lastPos);
  }
  return '"' + result + '"';
}
function insertAndGetRef(obj, pos) {
  const ref = toRefParam(REF_COUNT++);
  INDEX_OR_REF.set(obj, ref);
  if (pos) {
    BUFFER[pos - 1] += ref + "=";
  } else {
    BUFFER[pos] = ref + "=" + BUFFER[pos];
  }
  return ref;
}
function refParamsString() {
  let result = REF_START_CHARS[0];
  for (let i = 1; i < REF_COUNT; i++) {
    result += "," + toRefParam(i);
  }
  REF_COUNT = 0;
  return result;
}
function toRefParam(index) {
  let mod = index % REF_START_CHARS_LEN;
  let ref = REF_START_CHARS[mod];
  index = (index - mod) / REF_START_CHARS_LEN;
  while (index > 0) {
    mod = index % REF_CHARS_LEN;
    ref += REF_CHARS[mod];
    index = (index - mod) / REF_CHARS_LEN;
  }
  return ref;
}
function renderToString$1(code, options = {}) {
  let scripts = "";
  sharedConfig.context = {
    id: options.renderId || "",
    count: 0,
    suspense: {},
    assets: [],
    nonce: options.nonce,
    writeResource(id, p, error) {
      if (sharedConfig.context.noHydrate) return;
      if (error) return (scripts += `_$HY.set("${id}", ${serializeError(p)});`);
      scripts += `_$HY.set("${id}", ${stringify(p)});`;
    },
  };
  let html = resolveSSRNode(escape$1(code()));
  sharedConfig.context.noHydrate = true;
  html = injectAssets(sharedConfig.context.assets, html);
  if (scripts.length) html = injectScripts(html, scripts, options.nonce);
  return html;
}
function ssr(t, ...nodes) {
  if (nodes.length) {
    let result = "";
    for (let i = 0; i < nodes.length; i++) {
      result += t[i];
      const node = nodes[i];
      if (node !== undefined) result += resolveSSRNode(node);
    }
    t = result + t[nodes.length];
  }
  return {
    t,
  };
}
function ssrClassList(value) {
  if (!value) return "";
  let classKeys = Object.keys(value),
    result = "";
  for (let i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
      classValue = !!value[key];
    if (!key || key === "undefined" || !classValue) continue;
    i && (result += " ");
    result += key;
  }
  return result;
}
function ssrStyle(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  let result = "";
  const k = Object.keys(value);
  for (let i = 0; i < k.length; i++) {
    const s = k[i];
    const v = value[s];
    if (v != undefined) {
      if (i) result += ";";
      result += `${s}:${escape$1(v, true)}`;
    }
  }
  return result;
}
function ssrElement(tag, props, children, needsId) {
  let result = `<${tag}${needsId ? ssrHydrationKey() : ""} `;
  if (props == null) props = {};
  else if (typeof props === "function") props = props();
  const keys = Object.keys(props);
  let classResolved;
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (ChildProperties.has(prop)) {
      if (children === undefined)
        children = prop === "innerHTML" ? props[prop] : escape$1(props[prop]);
      continue;
    }
    const value = props[prop];
    if (prop === "style") {
      result += `style="${ssrStyle(value)}"`;
    } else if (
      prop === "class" ||
      prop === "className" ||
      prop === "classList"
    ) {
      if (classResolved) continue;
      let n;
      result += `class="${(n = props.class) ? n + " " : ""}${
        (n = props.className) ? n + " " : ""
      }${ssrClassList(props.classList)}"`;
      classResolved = true;
    } else if (BooleanAttributes.has(prop)) {
      if (value) result += prop;
      else continue;
    } else if (
      value == undefined ||
      prop === "ref" ||
      prop.slice(0, 2) === "on"
    ) {
      continue;
    } else {
      result += `${Aliases[prop] || prop}="${escape$1(value, true)}"`;
    }
    if (i !== keys.length - 1) result += " ";
  }
  return {
    t: result + `>${resolveSSRNode(children)}</${tag}>`,
  };
}
function ssrHydrationKey() {
  const hk = getHydrationKey();
  return hk ? ` data-hk="${hk}"` : "";
}
function escape$1(s, attr) {
  const t = typeof s;
  if (t !== "string") {
    if (!attr && t === "function") return escape$1(s(), attr);
    if (!attr && Array.isArray(s)) {
      let r = "";
      for (let i = 0; i < s.length; i++)
        r += resolveSSRNode(escape$1(s[i], attr));
      return {
        t: r,
      };
    }
    if (attr && t === "boolean") return String(s);
    return s;
  }
  const delim = attr ? '"' : "<";
  const escDelim = attr ? "&quot;" : "&lt;";
  let iDelim = s.indexOf(delim);
  let iAmp = s.indexOf("&");
  if (iDelim < 0 && iAmp < 0) return s;
  let left = 0,
    out = "";
  while (iDelim >= 0 && iAmp >= 0) {
    if (iDelim < iAmp) {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } else {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  }
  if (iDelim >= 0) {
    do {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } while (iDelim >= 0);
  } else
    while (iAmp >= 0) {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  return left < s.length ? out + s.substring(left) : out;
}
function resolveSSRNode(node) {
  const t = typeof node;
  if (t === "string") return node;
  if (node == null || t === "boolean") return "";
  if (Array.isArray(node)) {
    let mapped = "";
    for (let i = 0, len = node.length; i < len; i++)
      mapped += resolveSSRNode(node[i]);
    return mapped;
  }
  if (t === "object") return node.t;
  if (t === "function") return resolveSSRNode(node());
  return String(node);
}
function getHydrationKey() {
  const hydrate = sharedConfig.context;
  return hydrate && !hydrate.noHydrate && `${hydrate.id}${hydrate.count++}`;
}
function injectAssets(assets, html) {
  if (!assets || !assets.length) return html;
  let out = "";
  for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
  return html.replace(`</head>`, out + `</head>`);
}
function injectScripts(html, scripts, nonce) {
  const tag = `<script${nonce ? ` nonce="${nonce}"` : ""}>${scripts}</script>`;
  const index = html.indexOf("<!--xs-->");
  if (index > -1) {
    return html.slice(0, index) + tag + html.slice(index);
  }
  return html + tag;
}
function serializeError(error) {
  if (error.message) {
    const fields = {};
    const keys = Object.getOwnPropertyNames(error);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = error[key];
      if (!value || (key !== "message" && typeof value !== "function")) {
        fields[key] = value;
      }
    }
    return `Object.assign(new Error(${stringify(error.message)}), ${stringify(
      fields
    )})`;
  }
  return stringify(error);
}

const contexts = /* @__PURE__ */ new WeakMap();
function getContext(result) {
  if (contexts.has(result)) {
    return contexts.get(result);
  }
  let ctx = {
    c: 0,
    get id() {
      return "s" + this.c.toString();
    },
  };
  contexts.set(result, ctx);
  return ctx;
}
function incrementId(ctx) {
  let id = ctx.id;
  ctx.c++;
  return id;
}

const slotName$1 = (str) =>
  str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
function check$2(Component, props, children) {
  if (typeof Component !== "function") return false;
  const { html } = renderToStaticMarkup$2.call(
    this,
    Component,
    props,
    children
  );
  return typeof html === "string";
}
function renderToStaticMarkup$2(
  Component,
  props,
  { default: children, ...slotted },
  metadata
) {
  const renderId = (metadata == null ? void 0 : metadata.hydrate)
    ? incrementId(getContext(this.result))
    : "";
  const html = renderToString$1(
    () => {
      const slots = {};
      for (const [key, value] of Object.entries(slotted)) {
        const name = slotName$1(key);
        slots[name] = ssr(`<astro-slot name="${name}">${value}</astro-slot>`);
      }
      const newProps = {
        ...props,
        ...slots,
        children:
          children != null
            ? ssr(`<astro-slot>${children}</astro-slot>`)
            : children,
      };
      return createComponent$1(Component, newProps);
    },
    {
      renderId,
    }
  );
  return {
    attrs: {
      "data-solid-render-id": renderId,
    },
    html,
  };
}
var server_default$1 = {
  check: check$2,
  renderToStaticMarkup: renderToStaticMarkup$2,
};

function check$1(Component) {
  return Component["render"] && Component["$$render"];
}

async function renderToStaticMarkup$1(Component, props, slotted) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    slots[key] = () =>
      `<astro-slot${
        key === "default" ? "" : ` name="${key}"`
      }>${value}</astro-slot>`;
  }
  const { html } = Component.render(props, { $$slots: slots });
  return { html };
}

const _renderer1 = {
  check: check$1,
  renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.6.12";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error(
      "Deprecated: Astro.fetchContent() has been replaced with Astro.glob()."
    );
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(
        `Astro.glob(${JSON.stringify(globValue())}) - no matches found.`
      );
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce(
        (u, segment) => new URL(segment, u),
        referenceURL
      ).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    },
  };
}

const escapeHTML = escape$2;
class HTMLBytes extends Uint8Array {}
Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
  get() {
    return "HTMLBytes";
  },
});
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
async function* unescapeChunksAsync(iterable) {
  for await (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return (result._metadata.hasHydrationScript = true);
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default,
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${
        getDirectiveScriptText(directive) + astro_island_prebuilt_default
      }<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    title: "Unknown compiler error.",
    code: 1e3,
  },
  StaticRedirectNotAvailable: {
    title: "`Astro.redirect` is not available in static mode.",
    code: 3001,
    message:
      "Redirects are only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR.",
  },
  ClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in current adapter.",
    code: 3002,
    message: (adapterName) =>
      `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`,
  },
  StaticClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in static mode.",
    code: 3003,
    message:
      "`Astro.clientAddress` is only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR.",
  },
  NoMatchingStaticPathFound: {
    title: "No static path found for requested path.",
    code: 3004,
    message: (pathName) =>
      `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
    hint: (possibleRoutes) =>
      `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`,
  },
  OnlyResponseCanBeReturned: {
    title: "Invalid type returned by Astro page.",
    code: 3005,
    message: (route, returnedValue) =>
      `Route ${
        route ? route : ""
      } returned a \`${returnedValue}\`. Only a Response can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information.",
  },
  MissingMediaQueryDirective: {
    title: "Missing value for `client:media` directive.",
    code: 3006,
    message:
      'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided',
  },
  NoMatchingRenderer: {
    title: "No matching renderer found.",
    code: 3007,
    message: (
      componentName,
      componentExtension,
      plural,
      validRenderersCount
    ) => `Unable to render \`${componentName}\`.

${
  validRenderersCount > 0
    ? `There ${plural ? "are." : "is."} ${validRenderersCount} renderer${
        plural ? "s." : ""
      } configured in your \`astro.config.mjs\` file,
but ${
        plural ? "none were." : "it was not."
      } able to server-side render \`${componentName}\`.`
    : `No valid renderer was found ${
        componentExtension
          ? `for the \`.${componentExtension}\` file extension.`
          : `for this file extension.`
      }`
}`,
    hint: (
      probableRenderers
    ) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`,
  },
  NoClientEntrypoint: {
    title: "No client entrypoint specified in renderer.",
    code: 3008,
    message: (componentName, clientDirective, rendererName) =>
      `\`${componentName}\` component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by \`${rendererName}\`.`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer.",
  },
  NoClientOnlyHint: {
    title: "Missing hint on client:only directive.",
    code: 3009,
    message: (componentName) =>
      `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) =>
      `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`,
  },
  InvalidGetStaticPathParam: {
    title: "Invalid value returned by a `getStaticPaths` path.",
    code: 3010,
    message: (paramType) =>
      `Invalid params given to \`getStaticPaths\` path. Expected an \`object\`, got \`${paramType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths.",
  },
  InvalidGetStaticPathsReturn: {
    title: "Invalid value returned by getStaticPaths.",
    code: 3011,
    message: (returnType) =>
      `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths.",
  },
  GetStaticPathsRemovedRSSHelper: {
    title: "getStaticPaths RSS helper is not available anymore.",
    code: 3012,
    message:
      "The RSS helper has been removed from `getStaticPaths`. Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information.",
  },
  GetStaticPathsExpectedParams: {
    title: "Missing params property on `getStaticPaths` route.",
    code: 3013,
    message:
      "Missing or empty required `params` property on `getStaticPaths` route.",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths.",
  },
  GetStaticPathsInvalidRouteParam: {
    title: "Invalid value for `getStaticPaths` route parameter.",
    code: 3014,
    message: (key, value, valueType) =>
      `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths.",
  },
  GetStaticPathsRequired: {
    title: "`getStaticPaths()` function required for dynamic routes.",
    code: 3015,
    message:
      "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`,
  },
  ReservedSlotName: {
    title: "Invalid slot name.",
    code: 3016,
    message: (slotName) =>
      `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`,
  },
  NoAdapterInstalled: {
    title: "Cannot use Server-side Rendering without an adapter.",
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information.",
  },
  NoMatchingImport: {
    title: "No import found for component.",
    code: 3018,
    message: (componentName) =>
      `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
    hint: "Please make sure the component is properly imported.",
  },
  UnknownViteError: {
    title: "Unknown Vite Error.",
    code: 4e3,
  },
  FailedToLoadModuleSSR: {
    title: "Could not import file.",
    code: 4001,
    message: (importName) => `Could not import \`${importName}\`.`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists.",
  },
  InvalidGlob: {
    title: "Invalid glob pattern.",
    code: 4002,
    message: (globPattern) =>
      `Invalid glob pattern: \`${globPattern}\`. Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns.",
  },
  UnknownCSSError: {
    title: "Unknown CSS Error.",
    code: 5e3,
  },
  CSSSyntaxError: {
    title: "CSS Syntax Error.",
    code: 5001,
  },
  UnknownMarkdownError: {
    title: "Unknown Markdown Error.",
    code: 6e3,
  },
  MarkdownFrontmatterParseError: {
    title: "Failed to parse Markdown frontmatter.",
    code: 6001,
  },
  UnknownConfigError: {
    title: "Unknown configuration error.",
    code: 7e3,
  },
  ConfigNotFound: {
    title: "Specified configuration file not found.",
    code: 7001,
    message: (configFile) =>
      `Unable to resolve \`--config "${configFile}"\`. Does the file exist?`,
  },
  ConfigLegacyKey: {
    title: "Legacy configuration detected.",
    code: 7002,
    message: (legacyConfigKey) =>
      `Legacy configuration detected: \`${legacyConfigKey}\`.`,
    hint: "Please update your configuration to the new format.\nSee https://astro.build/config for more information.",
  },
  UnknownError: {
    title: "Unknown Error.",
    code: 99999,
  },
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find(
    (data) => data[1].code === code
  );
  if (entry) {
    return {
      name: entry[0],
      data: entry[1],
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src)
    .split("\n")
    .map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n]) visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth) gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(
        " "
      )}  | ${Array.from({
        length: loc.column,
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, title, message, stack, location, hint, frame } = props;
    this.errorCode = code;
    if (name) {
      this.name = name;
    } else {
      this.name =
        ((_a = getErrorDataByCode(this.errorCode)) == null
          ? void 0
          : _a.name) ?? "UnknownError";
    }
    this.title = title;
    if (message) this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    var _a;
    this.errorCode = errorCode;
    this.name =
      ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ??
      "UnknownError";
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err.type === "AstroError";
  }
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10,
};
function serializeArray(
  value,
  metadata = {},
  parents = /* @__PURE__ */ new WeakSet()
) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(
  value,
  metadata = {},
  parents = /* @__PURE__ */ new WeakSet()
) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(
  value,
  metadata = {},
  parents = /* @__PURE__ */ new WeakSet()
) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents)),
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents)),
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [
        PROP_TYPE.JSON,
        JSON.stringify(serializeArray(value, metadata, parents)),
      ];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function") item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name]) push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return (
    !!value && typeof value === "object" && typeof value.then === "function"
  );
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(
  HydrationDirectivesRaw.map((n) => `client:${n}`)
);
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" },
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (
            extracted.hydration.directive === "media" &&
            typeof extracted.hydration.value !== "string"
          ) {
            throw new AstroError(AstroErrorData.MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId,
    },
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer.clientEntrypoint)
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve(
    "astro:scripts/before-hydration.js"
  );
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || "",
    })
  );
  return island;
}

function validateComponentProps(props, displayName) {
  var _a;
  if (
    ((_a = Object.assign(
      { BASE_URL: "/", MODE: "production", DEV: false, PROD: true },
      { _: process.env._ }
    )) == null
      ? void 0
      : _a.DEV) &&
    props != null
  ) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return (
    typeof obj === "object" &&
    Object.prototype.toString.call(obj) === "[object AstroComponent]"
  );
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let parts = new HTMLParts();
  for await (const chunk of renderAstroComponent(Component)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
async function renderToIterable(
  result,
  componentFactory,
  displayName,
  props,
  children
) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0);
  else if (
    child instanceof AstroComponent ||
    Object.prototype.toString.call(child) === "[object AstroComponent]"
  ) {
    yield* renderAstroComponent(child);
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (
    typeof child === "object" &&
    (Symbol.asyncIterator in child || Symbol.iterator in child)
  ) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(([key, value]) =>
        renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript =
        hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript =
        hydration &&
        determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript
        ? "both"
        : needsDirectiveScript
        ? "directive"
        : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case !vnode && vnode !== 0:
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (
            key === "children" ||
            (value && typeof value === "object" && value["$$slot"])
          ) {
            slots[key === "children" ? "default" : key] = () =>
              renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(
          await renderToString(result, vnode.type, props, slots)
        );
      }
      case !vnode.type && vnode.type !== 0:
        return "";
      case typeof vnode.type === "string" &&
        vnode.type !== ClientOnlyPlaceholder:
        return markHTMLString(
          await renderElement$1(result, vnode.type, vnode.props ?? {})
        );
    }
    if (vnode.type) {
      let extractSlots2 = function (child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [
            ...(_slots[child.props.slot] ?? []),
            child,
          ];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: [],
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0) return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag)
        ? `/>`
        : `>${
            children == null ? "" : await renderJSX(result, children)
          }</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {}
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError =
      msg.includes("Warning: Invalid hook call.") &&
      msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError) return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames =
  /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes =
  /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes =
  /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) =>
  k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
    if (/[^\w]|\s/.test(match)) return "";
    return index === 0 ? match : match.toUpperCase();
  });
const toAttributeString = (value, shouldEscape = true) =>
  shouldEscape
    ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;")
    : value;
const kebab = (k) =>
  k.toLowerCase() === k
    ? k
    : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `${kebab(k)}:${v}`)
    .join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(
      serializeListValue(value),
      shouldEscape
    );
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (
    key === "style" &&
    !(value instanceof HTMLString) &&
    typeof value === "object"
  ) {
    return markHTMLString(
      ` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`
    );
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (
    value === true &&
    (key.startsWith("data-") || htmlBooleanAttributes.test(key))
  ) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(
      ` ${key}="${toAttributeString(value, shouldEscape)}"`
    );
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(
  name,
  { props: _props, children = "" },
  shouldEscape = true
) {
  const {
    lang: _,
    "data-astro-id": astroId,
    "define:vars": defineVars,
    ...props
  } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(
    props,
    shouldEscape
  )}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return (
    typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component)
  );
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(
      result,
      slots == null ? void 0 : slots.default
    )}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  const assignedName = constructor.name
    .replace(/^HTML|Element$/g, "")
    .replace(/[A-Z]/g, "-$&")
    .toLowerCase()
    .replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue (jsx)",
      ];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte",
      ];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(
  result,
  displayName,
  Component,
  _props,
  slots = {},
  route
) {
  var _a, _b;
  Component = (await Component) ?? Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(
        result,
        slots == null ? void 0 : slots.default
      );
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const { slotInstructions: slotInstructions2, children: children2 } =
        await renderSlots(result, slots);
      const html2 = Component.render({ slots: children2 });
      const hydrationHtml = slotInstructions2
        ? slotInstructions2
            .map((instr) => stringifyChunk(result, instr))
            .join("")
        : "";
      return markHTMLString(hydrationHtml + html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(
          result,
          Component,
          displayName,
          _props,
          slots
        );
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {}
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (
      !renderer &&
      typeof HTMLElement === "function" &&
      componentIsHTMLElement(Component)
    ) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName)
        ? rendererAliases.get(passedName)
        : passedName;
      renderer = renderers.find(
        ({ name }) =>
          name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname =
        (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        ),
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter((r) =>
        probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null
              ? void 0
              : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          ),
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (
    renderer &&
    !renderer.clientEntrypoint &&
    renderer.name !== "@astrojs/lit" &&
    metadata.hydrate
  ) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      ),
    });
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(
        props
      )}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component)
          ? `/>`
          : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return (async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (
        isPage ||
        (renderer == null ? void 0 : renderer.name) === "astro:jsx"
      ) {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    })();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(props, metadata)}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (
          !html.includes(
            key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`
          )
        ) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template =
    unrenderedSlots.length > 0
      ? unrenderedSlots
          .map(
            (key) =>
              `<template data-astro-template${
                key !== "default" ? `="${key}"` : ""
              }>${children[key]}</template>`
          )
          .join("")
      : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return (
    index ===
    all.findIndex(
      (i) => JSON.stringify(i.props) === props && i.children == children
    )
  );
};
function renderHead(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles)
    .filter(uniqueElements)
    .map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts)
    .filter(uniqueElements)
    .map((script, i) => {
      return renderElement("script", script, false);
    });
  const links = Array.from(result.links)
    .filter(uniqueElements)
    .map((link) => renderElement("link", link, false));
  return markHTMLString(
    links.join("\n") + styles.join("\n") + scripts.join("\n")
  );
}
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" &&
  Object.prototype.toString.call(process) === "[object process]";

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function __astro_tag_component__(Component, rendererName) {
  if (!Component) return;
  if (typeof Component !== "function") return;
  Object.defineProperty(Component, Renderer, {
    value: rendererName,
    enumerable: false,
    writable: false,
  });
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string") return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child)) return;
    if (!("slot" in child.props)) return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children
      .map((child) => {
        if (!isVNode(child)) return child;
        if (!("slot" in child.props)) return child;
        const name = toSlotName(child.props.slot);
        if (Array.isArray(slots[name])) {
          slots[name].push(child);
        } else {
          slots[name] = [child];
          slots[name]["$$slot"] = true;
        }
        delete child.props.slot;
        return Empty;
      })
      .filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string") return markHTMLString(child);
  if (Array.isArray(child)) return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props)) return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {},
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) =>
  str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(
  Component,
  props,
  { default: children = null, ...slotted } = {}
) {
  if (typeof Component !== "function") return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {}
  return false;
}
async function renderToStaticMarkup(
  Component,
  props = {},
  { default: children = null, ...slotted } = {}
) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(
    result,
    createVNode(Component, { ...props, ...slots, children })
  );
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup,
};

const $$Astro$j = createAstro(
  "/workspaces/skf-examination-platform/src/components/home/Home.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Home = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$Home;
  const { certificates } = Astro2.props;
  return renderTemplate`${maybeRenderHead(
    $$result
  )}<div class="wrapper jumbotron astro-66QRZ5M7">
  <h1 class="astro-66QRZ5M7">SKF Certifications</h1>
  <p class="astro-66QRZ5M7">
    We provide top notch certifications based on our open data and education
    platform where you can train and practise with hand-on labs. We are a
    Non-Profit foundation with the ony focus to create high quality content and
    education to everybody that is interested to improve and learn new skills in
    Cyber Security.
    <br class="astro-66QRZ5M7"><br class="astro-66QRZ5M7">
    The learning platform <a href="https://secureby.design" class="astro-66QRZ5M7">Security Knowledge Framework</a> can be used to prepare you for the certifications and prove you master the
    knowledge and hand-on skills to make a positive impact.
  </p>
  <div class="certificates astro-66QRZ5M7">
    ${certificates.map((certificate) => {
      const url = encodeURIComponent(certificate.name);
      return renderTemplate`<div class="certificate astro-66QRZ5M7">
            <h2 class="astro-66QRZ5M7">${certificate.name}</h2>
            <p class="astro-66QRZ5M7">${certificate.description}</p>
            <a class="btn astro-66QRZ5M7"${addAttribute(
              `/module/${url}`,
              "href"
            )}>
              Learn More
            </a>
          </div>`;
    })}
  </div>
</div>

`;
});

function noop() {}
const identity = (x) => x;
function assign(tar, src) {
  // @ts-ignore
  for (const k in src) tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === "object") || typeof a === "function";
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}

const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
  tasks.forEach((task) => {
    if (!task.c(now)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0) raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
  let task;
  if (tasks.size === 0) raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add((task = { c: callback, f: fulfill }));
    }),
    abort() {
      tasks.delete(task);
    },
  };
}

let current_component;
function set_current_component(component) {
  current_component = component;
}
Promise.resolve();
const ATTR_REGEX = /[&"]/g;
const CONTENT_REGEX = /[&<]/g;
/**
 * Note: this method is performance sensitive and has been optimized
 * https://github.com/sveltejs/svelte/pull/5701
 */
function escape(value, is_attr = false) {
  const str = String(value);
  const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped +=
      str.substring(last, i) +
      (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component") name += " this={...}";
    throw new Error(
      `<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`
    );
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(
        context || (parent_component ? parent_component.$$.context : [])
      ),
      // these will be immediately discarded
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object(),
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css)
            .map((css) => css.code)
            .join("\n"),
          map: null, // TODO
        },
        head: result.title + result.head,
      };
    },
    $$render,
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || (boolean && !value)) return "";
  const assignment =
    boolean && value === true ? "" : `="${escape(value, true)}"`;
  return ` ${name}${assignment}`;
}

async function getApiKey() {
  if (
    Object.assign(
      { BASE_URL: "/", MODE: "production", DEV: false, PROD: true },
      { _: process.env._ }
    )
  ) {
    return { BASE_URL: "/", MODE: "production", DEV: false, PROD: true }
      .PUBLIC_SUPABASE_API_KEY;
  }
  const dotenv = (await import("dotenv")).default;
  dotenv.config();
  return process.env.PUBLIC_SUPABASE_API_KEY;
}

const supabaseUrl$1 = "https://ccsgfooankckfqpmcfyb.supabase.co";
let supabaseClient = null;
const supabase = async () => {
  if (supabaseClient) return supabaseClient;
  const supabaseKey = (await getApiKey()) || "";
  return (supabaseClient = createClient(supabaseUrl$1, supabaseKey));
};

const supabaseUrl = "https://ccsgfooankckfqpmcfyb.supabase.co";
const supabaseSSR = async (context) => {
  const supabaseKey = (await getApiKey()) || "";
  return createServerSupabaseClient(supabaseUrl, supabaseKey, context);
};
function createServerSupabaseClient(
  supabaseUrl2,
  supabaseKey,
  context,
  { cookieOptions } = {}
) {
  return createServerSupabaseClient$1({
    supabaseUrl: supabaseUrl2,
    supabaseKey,
    getCookie(name) {
      return context.cookies.get(name).value;
    },
    setCookie(name, value, options) {
      context.cookies.set(name, value, {
        ...options,
        httpOnly: true,
      });
    },
    getRequestHeader: (key) => {
      return context.request.headers.get(key) ?? void 0;
    },
    cookieOptions,
  });
}

async function getSupabase(context) {
  if (!context) return await supabase();
  return await supabaseSSR(context);
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        // store is ready
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}

const user = writable();

/* src/components/Auth.svelte generated by Svelte v3.53.1 */

const Auth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_user;
  $$unsubscribe_user = subscribe(user, (value) => value);

  $$unsubscribe_user();
  return ``;
});

const $$Astro$i = createAstro(
  "/workspaces/skf-examination-platform/src/components/svgs/Logo.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Logo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Logo;
  return renderTemplate`${maybeRenderHead(
    $$result
  )}<svg width="48" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 75.3 86.9" xml:space="preserve">
  <style type="text/css">
    .st0 {
      fill: var(--text-primary);
    }
  </style>
  <path class="st0" d="M37.7,86.9L37,86.5c-0.9-0.5-1.9-1.1-2.8-1.8c-2.7-2-5-4.5-6.6-7.5c-1.7-3-2.8-6.2-3.3-9.6
	c0-0.3-0.1-0.5-0.1-0.8c-0.2,0.1-0.4,0.2-0.7,0.3c-3.1,1.3-6.5,2-9.9,2c-3.5,0-6.8-0.7-10-2c-1-0.4-1.9-0.9-2.8-1.4L0,65.3v-0.9
	c0-1.1,0.1-2.1,0.2-3.1c0.5-3.5,1.6-6.7,3.3-9.7c1.7-3,3.9-5.6,6.7-7.6c0.2-0.2,0.4-0.3,0.6-0.5c-0.2-0.2-0.4-0.3-0.7-0.5
	c-2.7-2-5-4.6-6.6-7.5c-1.8-3-2.9-6.2-3.3-9.6l0-0.1C0.1,24.7,0,23.6,0,22.6v-0.9l0.7-0.4c1-0.6,1.9-1.1,2.9-1.4c3.2-1.3,6.5-2,10-2
	c3.5,0,6.8,0.7,9.9,2c0.2,0.1,0.4,0.2,0.7,0.3c0-0.2,0-0.5,0.1-0.7c0.5-3.4,1.6-6.6,3.3-9.6c1.6-3,3.9-5.6,6.6-7.7
	C35.2,1.5,36.1,1,37,0.4L37.7,0l0.8,0.5C39.3,1,40.1,1.5,41,2.1c2.8,2.1,5.1,4.7,6.8,7.7c1.7,3,2.8,6.2,3.2,9.6c0,0.3,0,0.5,0.1,0.8
	c0.2-0.1,0.5-0.2,0.7-0.3c3.1-1.3,6.5-2,9.9-2c3.5,0,6.8,0.7,9.9,2c1,0.4,2,0.9,2.9,1.5l0.7,0.4v0.8c0,1,0,2-0.1,3.1l0,0.1
	c-0.5,3.4-1.5,6.7-3.2,9.6c-1.8,3-4,5.5-6.8,7.6c-0.2,0.2-0.4,0.3-0.6,0.5c0.2,0.2,0.4,0.3,0.6,0.5c2.7,2,5,4.6,6.7,7.6
	c1.7,3,2.8,6.2,3.2,9.7c0.1,1.1,0.1,2.1,0.1,3.1v0.9l-0.7,0.4c-0.9,0.5-1.8,1-2.8,1.4c-3.1,1.3-6.4,2-9.9,2c-3.5,0-6.8-0.7-10-2
	c-0.2-0.1-0.5-0.2-0.7-0.3c0,0.2,0,0.5-0.1,0.7c-0.4,3.4-1.5,6.7-3.2,9.7c-1.7,3-4,5.6-6.8,7.6c-0.8,0.7-1.7,1.3-2.6,1.8L37.7,86.9z
	 M27.1,64.3c0,0.9,0,1.9,0.1,2.8c0.4,2.9,1.4,5.8,3,8.5c1.5,2.6,3.4,4.9,5.8,6.6c0.6,0.4,1.1,0.8,1.6,1.2c0.5-0.3,1-0.7,1.5-1.1
	c2.5-1.8,4.5-4,6-6.7c1.5-2.7,2.5-5.6,2.9-8.5c0.1-0.6,0.1-1.3,0.1-1.9c-1.6-1-3.1-2.2-4.5-3.6c-2.4-2.3-4.3-5.1-5.5-8.1
	c-1-2.3-1.6-4.8-1.8-7.3c-1.8,1.3-3.3,2.8-4.7,4.6c-1.7,2.3-3,4.9-3.7,7.7C27.4,60.4,27.1,62.4,27.1,64.3z M50.4,63
	c0.8,0.4,1.7,0.9,2.6,1.2c2.8,1.2,5.8,1.8,8.8,1.8c3,0,6-0.6,8.7-1.8c0.6-0.3,1.2-0.5,1.7-0.8c0-0.7,0-1.3-0.1-2
	c-0.4-2.9-1.4-5.8-2.9-8.5c-1.5-2.7-3.5-4.9-5.9-6.7c-0.5-0.4-1.1-0.8-1.6-1.2c-1.7,0.9-3.5,1.6-5.4,2.1c-3.2,0.9-6.5,1.1-9.8,0.7
	c-2.5-0.3-4.9-1-7.2-2c0.2,2.2,0.8,4.3,1.6,6.3c1.1,2.7,2.8,5.1,4.9,7.1C47.2,60.8,48.8,62,50.4,63z M3,63.4
	c0.6,0.3,1.2,0.6,1.8,0.8c2.8,1.2,5.7,1.8,8.8,1.8c3,0,6-0.6,8.8-1.8c0.6-0.3,1.2-0.5,1.8-0.8c0.1-2,0.4-3.9,0.9-5.8
	c0.8-3.2,2.3-6.1,4.2-8.8c1.6-2,3.4-3.8,5.4-5.3c-2-0.9-4.1-1.5-6.2-1.7c-2.9-0.3-5.8-0.2-8.7,0.5c-1.8,0.5-3.6,1.3-5.4,2.3
	c-0.8,0.5-1.6,1-2.4,1.6c-2.4,1.8-4.4,4-5.8,6.7c-1.6,2.7-2.6,5.5-3,8.6C3.1,62.2,3,62.8,3,63.4z M40.7,43.3c2,0.8,4,1.4,6.2,1.7
	c2.9,0.4,5.8,0.2,8.7-0.6c1.8-0.4,3.5-1.1,5.1-2l0.4-0.2c0.7-0.4,1.5-1,2.3-1.5c2.4-1.8,4.4-4.1,6-6.7c1.5-2.6,2.4-5.5,2.8-8.5
	c0-0.7,0.1-1.4,0.1-2c-0.5-0.3-1.1-0.6-1.7-0.8c-2.8-1.2-5.7-1.8-8.8-1.8c-3,0-6,0.6-8.8,1.8c-0.6,0.2-1.2,0.5-1.8,0.8
	c-0.1,1.9-0.3,3.8-0.8,5.7c-0.9,3.2-2.3,6.2-4.3,8.9C44.5,40.1,42.7,41.8,40.7,43.3z M3.1,25.4c0.4,3,1.4,5.9,3,8.5
	c1.5,2.6,3.5,4.9,5.9,6.7c0.5,0.4,1.1,0.8,1.7,1.1c1.7-0.9,3.5-1.6,5.3-2.2c3.3-0.8,6.6-1,9.9-0.6c2.5,0.3,5,1,7.3,2
	c-0.3-2.2-0.8-4.3-1.7-6.4c-1.1-2.7-2.7-5.1-4.8-7.1c-0.8-0.8-1.6-1.5-2.5-2.2l-2.3-1.5c-0.7-0.5-1.6-0.9-2.4-1.2
	c-2.8-1.2-5.8-1.8-8.8-1.8c-3.1,0-6,0.6-8.8,1.8c-0.6,0.2-1.2,0.5-1.8,0.8C3,24.1,3.1,24.8,3.1,25.4z M27.1,21.7
	c1.7,1,3.2,2.2,4.6,3.7c2.3,2.3,4.1,5,5.4,8.1c1,2.4,1.6,4.8,1.9,7.3c1.7-1.3,3.3-2.8,4.6-4.6c1.7-2.4,3-5,3.8-7.8
	c0.5-1.9,0.7-3.9,0.7-5.8c0-0.9,0-1.9-0.1-2.9c-0.4-2.9-1.3-5.8-2.9-8.4c-1.5-2.7-3.5-5-6-6.8c-0.5-0.3-1-0.7-1.6-1
	c-0.6,0.3-1.1,0.7-1.7,1.1c-2.4,1.8-4.3,4.1-5.8,6.7c-1.5,2.7-2.5,5.5-3,8.5C27.2,20.4,27.1,21.1,27.1,21.7z"></path>
</svg>`;
});

/* src/components/Nav.svelte generated by Svelte v3.53.1 */

const css$6 = {
  code: "menu.svelte-14zmd9z.svelte-14zmd9z{list-style:none;display:flex;flex-direction:row;align-items:center;position:relative;gap:0.25rem}@media(min-width: 640px){menu.svelte-14zmd9z.svelte-14zmd9z{gap:0.5rem}}menu.svelte-14zmd9z a.svelte-14zmd9z{padding-left:1.25rem;padding-right:1.25rem;padding-top:0.75rem;padding-bottom:0.75rem}@media(min-width: 640px){menu.svelte-14zmd9z a.svelte-14zmd9z{padding-top:1rem;padding-bottom:1rem}}@media(min-width: 768px){menu.svelte-14zmd9z a.svelte-14zmd9z{padding-left:1.5rem;padding-right:1.5rem}}@media(min-width: 640px){menu.svelte-14zmd9z a.svelte-14zmd9z{padding-top:1rem;padding-bottom:1rem}}@media(min-width: 1024px){menu.svelte-14zmd9z a.svelte-14zmd9z{padding-left:2rem;padding-right:2rem}}menu.svelte-14zmd9z a.svelte-14zmd9z:hover{background-color:white;color:var(--primary-500);border-radius:0.25rem}.toggle.svelte-14zmd9z.svelte-14zmd9z{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;height:3rem;width:3rem;display:flex;align-items:center;justify-content:center;border-radius:9999px}.toggle.svelte-14zmd9z.svelte-14zmd9z:hover{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));color:var(--primary-500)}.menu.svelte-14zmd9z.svelte-14zmd9z{position:absolute;background-color:var(--primary-500);border-radius:0.25rem;box-shadow:0 0 1rem 0 rgba(0, 0, 0, 0.1);padding:0.75rem 1.25rem;right:0;top:3rem}.logout.svelte-14zmd9z.svelte-14zmd9z{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}",
  map: null,
};

const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  $$unsubscribe_user = subscribe(user, (value) => ($user = value));
  let { isLoggedin } = $$props;

  if (
    $$props.isLoggedin === void 0 &&
    $$bindings.isLoggedin &&
    isLoggedin !== void 0
  )
    $$bindings.isLoggedin(isLoggedin);
  $$result.css.add(css$6);
  $$unsubscribe_user();

  return `

<menu class="${"svelte-14zmd9z"}"><li><a href="${"/"}" class="${"svelte-14zmd9z"}">Home</a></li>
  <li><a href="${"/labs"}" class="${"svelte-14zmd9z"}">Labs</a></li>
  ${
    isLoggedin || $user
      ? `<li><a href="${"/dashboard"}" class="${"svelte-14zmd9z"}">Dashboard</a></li>
    <li><a href="${"/profile"}" class="${"svelte-14zmd9z"}">Profile</a></li>
    <li class="${"toggle svelte-14zmd9z"}"><svg width="${"1em"}" height="${"1em"}" viewBox="${"0 0 24 24"}"><path fill="${"currentColor"}" d="${"M17.754 14a2.249 2.249 0 0 1 2.249 2.25v.918a2.75 2.75 0 0 1-.513 1.598c-1.545 2.164-4.07 3.235-7.49 3.235c-3.421 0-5.944-1.072-7.486-3.236a2.75 2.75 0 0 1-.51-1.596v-.92A2.249 2.249 0 0 1 6.251 14h11.502ZM12 2.005a5 5 0 1 1 0 10a5 5 0 0 1 0-10Z"}"></path></svg></li>`
      : `<li><a href="${"/login"}" class="${"svelte-14zmd9z"}">Login/Register</a></li>`
  }

  ${``}
</menu>`;
});

const $$Astro$h = createAstro(
  "/workspaces/skf-examination-platform/src/components/NavWrapper.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$NavWrapper = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$NavWrapper;
  const { isLoggedin } = Astro2.props;
  return renderTemplate`${maybeRenderHead(
    $$result
  )}<nav class="wrapper astro-4X4BH5AG">
  <a href="/" class="logo astro-4X4BH5AG">
    ${renderComponent($$result, "Logo", $$Logo, { class: "astro-4X4BH5AG" })}
    <p class="lt-md:hidden astro-4X4BH5AG">SKF Examination Platform</p>
  </a>
  ${renderComponent($$result, "Nav", Nav, {
    "client:load": true,
    isLoggedin: isLoggedin,
    "client:component-hydration": "load",
    "client:component-path":
      "/workspaces/skf-examination-platform/src/components/Nav.svelte",
    "client:component-export": "default",
    class: "astro-4X4BH5AG",
  })}
</nav>

`;
});

const $$Astro$g = createAstro(
  "/workspaces/skf-examination-platform/src/layouts/BaseLayout.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, loadNav = true, isLoggedin } = Astro2.props;
  return renderTemplate`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.svg">
    <title>${title}</title>
  ${renderHead($$result)}</head>
  <body>
    ${renderComponent($$result, "Auth", Auth, {
      "client:load": true,
      "client:component-hydration": "load",
      "client:component-path":
        "/workspaces/skf-examination-platform/src/components/Auth.svelte",
      "client:component-export": "default",
    })}
    ${
      loadNav &&
      renderTemplate`${renderComponent($$result, "Nav", $$NavWrapper, {
        isLoggedin: isLoggedin,
      })}`
    }
    ${renderSlot($$result, $$slots["default"])}
  </body></html>`;
});

async function checkSession(context) {
  const { error, data } = await (await getSupabase(context)).auth.getSession();
  if (error) return false;
  if (data.session) return true;
  return false;
}

const certificates = [
  {
    name: "Secure software Development Fundamentals",
    description:
      "Modern software is under constant attack, but many software developers have never been told how to effectively counter those attacks. This certification is to cover that problem, by proving you master the fundamentals of developing secure software.",
    summary: {
      description:
        "This exam covers the basics of security, such as what risk management really means. It discusses how to consider security as part of the requirements of a system, and what potential security requirements you might consider. This part then discusses how to design software to be secure, including various secure design principles that will help you avoid bad designs and embrace good ones. It also discusses how to secure your software supply chain, that is, how to more securely select and acquire reused software (including open source software) to enhance security. This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
      list: [
        "What you'll learn",
        "- Security basics: risk management, the “CIA” triad, and requirements.",
        "- Secure design principles: what are principles such as “least privilege” and how to apply these principles.",
        "- Supply chain evaluation: tips on how to choose packages to reuse, and how to reuse them so that you can rapidly be alerted & update.",
        "- Implementation: You’ll learn how to implement much more secure software. This includes how to do Input validation, process data securely, call out to other programs, and send output. You’ll also learn about more specialized approaches, including some basics of cryptography and handling problems (such as error-handling code).",
        "- Security Verification: How to examine software, include some key tool types, and how to apply them in continuous integration (CI). This includes learning about security code scanners/static application security testing (SAST) tools, software composition analysis (SCA)/dependency analysis tools, fuzzers, and web application scanners.",
        "- Threat modeling/Attack modeling: How to consider your system from an attacker’s point of view and how to apply a simple design analysis approach called STRIDE.",
        "Fielding: How to deploy and operate secure software, handle vulnerability reports, and how to rapidly update when reused components have publicly-known vulnerabilities.",
        "- Assurance cases & formal methods: The basics of approaches to more strongly analyze and justify that your software is secure.",
      ],
      footer:
        "This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
    },
  },
  {
    name: "Java Secure software Development expert",
    description:
      "The fundamentals are important to master but in the expert certification we go deeper in the rabbit hole. We will cover the different layers of security based on the Application Security Verification Standard (OWASP-ASVS). This certification is to cover all, by verifying you master the advanced cases of developing secure software in Java.",
    summary: {
      description:
        "This exam covers the basics of security, such as what risk management really means. It discusses how to consider security as part of the requirements of a system, and what potential security requirements you might consider. This part then discusses how to design software to be secure, including various secure design principles that will help you avoid bad designs and embrace good ones. It also discusses how to secure your software supply chain, that is, how to more securely select and acquire reused software (including open source software) to enhance security. This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
      list: [
        "What you'll learn",
        "- Security basics: risk management, the “CIA” triad, and requirements.",
        "- Secure design principles: what are principles such as “least privilege” and how to apply these principles.",
        "- Supply chain evaluation: tips on how to choose packages to reuse, and how to reuse them so that you can rapidly be alerted & update.",
        "- Implementation: You’ll learn how to implement much more secure software. This includes how to do Input validation, process data securely, call out to other programs, and send output. You’ll also learn about more specialized approaches, including some basics of cryptography and handling problems (such as error-handling code).",
        "- Security Verification: How to examine software, include some key tool types, and how to apply them in continuous integration (CI). This includes learning about security code scanners/static application security testing (SAST) tools, software composition analysis (SCA)/dependency analysis tools, fuzzers, and web application scanners.",
        "- Threat modeling/Attack modeling: How to consider your system from an attacker’s point of view and how to apply a simple design analysis approach called STRIDE.",
        "Fielding: How to deploy and operate secure software, handle vulnerability reports, and how to rapidly update when reused components have publicly-known vulnerabilities.",
        "- Assurance cases & formal methods: The basics of approaches to more strongly analyze and justify that your software is secure.",
      ],
      footer:
        "This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
    },
  },
  {
    name: "Python Secure software Development expert",
    description:
      "The fundamentals are important to master but in the expert certification we go deeper in the rabbit hole. We will cover the different layers of security based on the Application Security Verification Standard (OWASP-ASVS). This certification is to cover all, by verifying you master the advanced cases of developing secure software in Python.",
    summary: {
      description:
        "This exam covers the basics of security, such as what risk management really means. It discusses how to consider security as part of the requirements of a system, and what potential security requirements you might consider. This part then discusses how to design software to be secure, including various secure design principles that will help you avoid bad designs and embrace good ones. It also discusses how to secure your software supply chain, that is, how to more securely select and acquire reused software (including open source software) to enhance security. This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
      list: [
        "What you'll learn",
        "- Security basics: risk management, the “CIA” triad, and requirements.",
        "- Secure design principles: what are principles such as “least privilege” and how to apply these principles.",
        "- Supply chain evaluation: tips on how to choose packages to reuse, and how to reuse them so that you can rapidly be alerted & update.",
        "- Implementation: You’ll learn how to implement much more secure software. This includes how to do Input validation, process data securely, call out to other programs, and send output. You’ll also learn about more specialized approaches, including some basics of cryptography and handling problems (such as error-handling code).",
        "- Security Verification: How to examine software, include some key tool types, and how to apply them in continuous integration (CI). This includes learning about security code scanners/static application security testing (SAST) tools, software composition analysis (SCA)/dependency analysis tools, fuzzers, and web application scanners.",
        "- Threat modeling/Attack modeling: How to consider your system from an attacker’s point of view and how to apply a simple design analysis approach called STRIDE.",
        "Fielding: How to deploy and operate secure software, handle vulnerability reports, and how to rapidly update when reused components have publicly-known vulnerabilities.",
        "- Assurance cases & formal methods: The basics of approaches to more strongly analyze and justify that your software is secure.",
      ],
      footer:
        "This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
    },
  },
  {
    name: "NodeJS Secure software Development expert",
    description:
      "The fundamentals are important to master but in the expert certification we go deeper in the rabbit hole. We will cover the different layers of security based on the Application Security Verification Standard (OWASP-ASVS). This certification is to cover all, by verifying you master the advanced cases of developing secure software in NodeJS.",
    summary: {
      description:
        "This exam covers the basics of security, such as what risk management really means. It discusses how to consider security as part of the requirements of a system, and what potential security requirements you might consider. This part then discusses how to design software to be secure, including various secure design principles that will help you avoid bad designs and embrace good ones. It also discusses how to secure your software supply chain, that is, how to more securely select and acquire reused software (including open source software) to enhance security. This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
      list: [
        "What you'll learn",
        "- Security basics: risk management, the “CIA” triad, and requirements.",
        "- Secure design principles: what are principles such as “least privilege” and how to apply these principles.",
        "- Supply chain evaluation: tips on how to choose packages to reuse, and how to reuse them so that you can rapidly be alerted & update.",
        "- Implementation: You’ll learn how to implement much more secure software. This includes how to do Input validation, process data securely, call out to other programs, and send output. You’ll also learn about more specialized approaches, including some basics of cryptography and handling problems (such as error-handling code).",
        "- Security Verification: How to examine software, include some key tool types, and how to apply them in continuous integration (CI). This includes learning about security code scanners/static application security testing (SAST) tools, software composition analysis (SCA)/dependency analysis tools, fuzzers, and web application scanners.",
        "- Threat modeling/Attack modeling: How to consider your system from an attacker’s point of view and how to apply a simple design analysis approach called STRIDE.",
        "Fielding: How to deploy and operate secure software, handle vulnerability reports, and how to rapidly update when reused components have publicly-known vulnerabilities.",
        "- Assurance cases & formal methods: The basics of approaches to more strongly analyze and justify that your software is secure.",
      ],
      footer:
        "This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
    },
  },
  {
    name: "WEB/API Penetration Testing",
    description:
      "Everyting is connected and the easiest way is building Web/API Applications to achieve this but they might have serious vulnerabilities. The defacto standard that is used to verify these and used by penetration testing teams is the Web Application Security Testing Guide (OWASP-WSTG). This certification is all about Web/API Application Penetration Testing and finding security holes in those applications.",
    summary: {
      description:
        "This exam covers the basics of security, such as what risk management really means. It discusses how to consider security as part of the requirements of a system, and what potential security requirements you might consider. This part then discusses how to design software to be secure, including various secure design principles that will help you avoid bad designs and embrace good ones. It also discusses how to secure your software supply chain, that is, how to more securely select and acquire reused software (including open source software) to enhance security. This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
      list: [
        "What you'll learn",
        "- Security basics: risk management, the “CIA” triad, and requirements.",
        "- Secure design principles: what are principles such as “least privilege” and how to apply these principles.",
        "- Supply chain evaluation: tips on how to choose packages to reuse, and how to reuse them so that you can rapidly be alerted & update.",
        "- Implementation: You’ll learn how to implement much more secure software. This includes how to do Input validation, process data securely, call out to other programs, and send output. You’ll also learn about more specialized approaches, including some basics of cryptography and handling problems (such as error-handling code).",
        "- Security Verification: How to examine software, include some key tool types, and how to apply them in continuous integration (CI). This includes learning about security code scanners/static application security testing (SAST) tools, software composition analysis (SCA)/dependency analysis tools, fuzzers, and web application scanners.",
        "- Threat modeling/Attack modeling: How to consider your system from an attacker’s point of view and how to apply a simple design analysis approach called STRIDE.",
        "Fielding: How to deploy and operate secure software, handle vulnerability reports, and how to rapidly update when reused components have publicly-known vulnerabilities.",
        "- Assurance cases & formal methods: The basics of approaches to more strongly analyze and justify that your software is secure.",
      ],
      footer:
        "This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
    },
  },
  {
    name: "Infra Penetration Testing",
    description:
      "Everyting is connected and the easiest way is building Web/API Applications to achieve this but they might have serious vulnerabilities. The defacto standard that is used to verify these and used by penetration testing teams is the Web Application Security Testing Guide (OWASP-WSTG). This certification is all about Web/API Application Penetration Testing and finding security holes in those applications.",
    summary: {
      description:
        "This exam covers the basics of security, such as what risk management really means. It discusses how to consider security as part of the requirements of a system, and what potential security requirements you might consider. This part then discusses how to design software to be secure, including various secure design principles that will help you avoid bad designs and embrace good ones. It also discusses how to secure your software supply chain, that is, how to more securely select and acquire reused software (including open source software) to enhance security. This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
      list: [
        "What you'll learn",
        "- Security basics: risk management, the “CIA” triad, and requirements.",
        "- Secure design principles: what are principles such as “least privilege” and how to apply these principles.",
        "- Supply chain evaluation: tips on how to choose packages to reuse, and how to reuse them so that you can rapidly be alerted & update.",
        "- Implementation: You’ll learn how to implement much more secure software. This includes how to do Input validation, process data securely, call out to other programs, and send output. You’ll also learn about more specialized approaches, including some basics of cryptography and handling problems (such as error-handling code).",
        "- Security Verification: How to examine software, include some key tool types, and how to apply them in continuous integration (CI). This includes learning about security code scanners/static application security testing (SAST) tools, software composition analysis (SCA)/dependency analysis tools, fuzzers, and web application scanners.",
        "- Threat modeling/Attack modeling: How to consider your system from an attacker’s point of view and how to apply a simple design analysis approach called STRIDE.",
        "Fielding: How to deploy and operate secure software, handle vulnerability reports, and how to rapidly update when reused components have publicly-known vulnerabilities.",
        "- Assurance cases & formal methods: The basics of approaches to more strongly analyze and justify that your software is secure.",
      ],
      footer:
        "This is the first of the three courses in the Secure Software Development Fundamentals Professional Certificate program, and was developed by the Open Source Security Foundation (OpenSSF), a project of the Linux Foundation focused on securing the open source ecosystem. The training courses included in this program focus on practical steps that you (as a developer) can take to counter most common kinds of attacks.",
    },
  },
];

const $$Astro$f = createAstro(
  "/workspaces/skf-examination-platform/src/pages/index.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$Index$1;
  const isLoggedin = await checkSession(Astro2);
  return renderTemplate`${renderComponent(
    $$result,
    "BaseLayout",
    $$BaseLayout,
    { title: "SKF", isLoggedin: isLoggedin },
    {
      default: () =>
        renderTemplate`${renderComponent($$result, "Home", $$Home, {
          certificates: certificates,
        })}`,
    }
  )}`;
});

const $$file$9 = "/workspaces/skf-examination-platform/src/pages/index.astro";
const $$url$9 = "";

const _page0 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$Index$1,
      file: $$file$9,
      url: $$url$9,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) =>
  __freeze(
    __defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) })
  );
var _a;
const $$Astro$e = createAstro(
  "/workspaces/skf-examination-platform/src/pages/lab-sandbox-sample.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$LabSandboxSample = createComponent(
  async ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
    Astro2.self = $$LabSandboxSample;
    const labName = "Lab";
    const isLoggedin = await checkSession(Astro2);
    return renderTemplate(
      _a ||
        (_a = __template([
          "",
          '\n\n\n\n<script>\n  const btn = document.querySelector("button");\n  const input = document.querySelector("input");\n  /** @type {HTMLDivElement} */\n  const flag = document.querySelector(".flag");\n\n  btn.addEventListener("click", () => {\n    const value = input.value;\n    flag.style.marginTop = "20px";\n    if (value === "skf") {\n      flag.innerHTML = "SKF{1nput_1s_4w3s0m3}";\n    } else {\n      flag.innerHTML = "Try again!";\n    }\n  });\n\n  // change lab name to the lab url param\n  const labName = new URLSearchParams(window.location.search).get("lab");\n  document.querySelector("h1").innerHTML = labName;\n</script>',
        ])),
      renderComponent(
        $$result,
        "BaseLayout",
        $$BaseLayout,
        {
          title: labName,
          loadNav: false,
          isLoggedin: isLoggedin,
          class: "astro-KHCKDDQM",
        },
        {
          default: () => renderTemplate`${maybeRenderHead(
            $$result
          )}<header class="astro-KHCKDDQM">
    <div class="wrapper astro-KHCKDDQM">
      <div class="logo astro-KHCKDDQM">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75.3 86.9" style="enable-background:new 0 0 75.3 86.9" xml:space="preserve" class="astro-KHCKDDQM">
          <path fill="currentColor" d="m37.7
									86.9-.7-.4c-.9-.5-1.9-1.1-2.8-1.8-2.7-2-5-4.5-6.6-7.5-1.7-3-2.8-6.2-3.3-9.6
									0-.3-.1-.5-.1-.8-.2.1-.4.2-.7.3-3.1 1.3-6.5 2-9.9 2-3.5
									0-6.8-.7-10-2-1-.4-1.9-.9-2.8-1.4l-.8-.4v-.9c0-1.1.1-2.1.2-3.1.5-3.5
									1.6-6.7 3.3-9.7 1.7-3 3.9-5.6
									6.7-7.6.2-.2.4-.3.6-.5-.2-.2-.4-.3-.7-.5-2.7-2-5-4.6-6.6-7.5-1.8-3-2.9-6.2-3.3-9.6v-.1c-.1-1.1-.2-2.2-.2-3.2v-.9l.7-.4c1-.6
									1.9-1.1 2.9-1.4 3.2-1.3 6.5-2 10-2s6.8.7 9.9 2c.2.1.4.2.7.3 0-.2
									0-.5.1-.7.5-3.4 1.6-6.6 3.3-9.6 1.6-3 3.9-5.6 6.6-7.7 1-.7 1.9-1.2
									2.8-1.8l.7-.4.8.5c.8.5 1.6 1 2.5 1.6 2.8 2.1 5.1 4.7 6.8 7.7 1.7 3 2.8
									6.2 3.2 9.6 0 .3 0 .5.1.8.2-.1.5-.2.7-.3 3.1-1.3 6.5-2 9.9-2 3.5 0
									6.8.7 9.9 2 1 .4 2 .9 2.9 1.5l.7.4v.8c0 1 0 2-.1 3.1v.1c-.5 3.4-1.5
									6.7-3.2 9.6-1.8 3-4 5.5-6.8 7.6-.2.2-.4.3-.6.5.2.2.4.3.6.5 2.7 2 5 4.6
									6.7 7.6 1.7 3 2.8 6.2 3.2 9.7.1 1.1.1 2.1.1 3.1v.9l-.7.4c-.9.5-1.8
									1-2.8 1.4-3.1 1.3-6.4 2-9.9 2s-6.8-.7-10-2c-.2-.1-.5-.2-.7-.3 0 .2 0
									.5-.1.7-.4 3.4-1.5 6.7-3.2 9.7-1.7 3-4 5.6-6.8 7.6-.8.7-1.7 1.3-2.6
									1.8l-.6.3zM27.1 64.3c0 .9 0 1.9.1 2.8.4 2.9 1.4 5.8 3 8.5 1.5 2.6 3.4
									4.9 5.8 6.6.6.4 1.1.8 1.6 1.2.5-.3 1-.7 1.5-1.1 2.5-1.8 4.5-4
									6-6.7s2.5-5.6
									2.9-8.5c.1-.6.1-1.3.1-1.9-1.6-1-3.1-2.2-4.5-3.6-2.4-2.3-4.3-5.1-5.5-8.1-1-2.3-1.6-4.8-1.8-7.3-1.8
									1.3-3.3 2.8-4.7 4.6-1.7 2.3-3 4.9-3.7 7.7-.5 1.9-.8 3.9-.8 5.8zM50.4
									63c.8.4 1.7.9 2.6 1.2 2.8 1.2 5.8 1.8 8.8 1.8 3 0 6-.6 8.7-1.8.6-.3
									1.2-.5 1.7-.8 0-.7
									0-1.3-.1-2-.4-2.9-1.4-5.8-2.9-8.5s-3.5-4.9-5.9-6.7c-.5-.4-1.1-.8-1.6-1.2-1.7.9-3.5
									1.6-5.4 2.1-3.2.9-6.5 1.1-9.8.7-2.5-.3-4.9-1-7.2-2 .2 2.2.8 4.3 1.6 6.3
									1.1 2.7 2.8 5.1 4.9 7.1 1.4 1.6 3 2.8 4.6 3.8zM3 63.4c.6.3 1.2.6 1.8.8
									2.8 1.2 5.7 1.8 8.8 1.8 3 0 6-.6 8.8-1.8.6-.3 1.2-.5 1.8-.8.1-2
									.4-3.9.9-5.8.8-3.2 2.3-6.1 4.2-8.8 1.6-2 3.4-3.8
									5.4-5.3-2-.9-4.1-1.5-6.2-1.7-2.9-.3-5.8-.2-8.7.5-1.8.5-3.6 1.3-5.4
									2.3-.8.5-1.6 1-2.4 1.6-2.4 1.8-4.4 4-5.8 6.7-1.6 2.7-2.6 5.5-3
									8.6-.1.7-.2 1.3-.2 1.9zm37.7-20.1c2 .8 4 1.4 6.2 1.7 2.9.4 5.8.2 8.7-.6
									1.8-.4 3.5-1.1 5.1-2l.4-.2c.7-.4 1.5-1 2.3-1.5 2.4-1.8 4.4-4.1 6-6.7
									1.5-2.6 2.4-5.5 2.8-8.5
									0-.7.1-1.4.1-2-.5-.3-1.1-.6-1.7-.8-2.8-1.2-5.7-1.8-8.8-1.8-3 0-6 .6-8.8
									1.8-.6.2-1.2.5-1.8.8-.1 1.9-.3 3.8-.8 5.7-.9 3.2-2.3 6.2-4.3 8.9-1.6
									2-3.4 3.7-5.4 5.2zM3.1 25.4c.4 3 1.4 5.9 3 8.5 1.5 2.6 3.5 4.9 5.9
									6.7.5.4 1.1.8 1.7 1.1 1.7-.9 3.5-1.6 5.3-2.2 3.3-.8 6.6-1 9.9-.6 2.5.3
									5 1 7.3
									2-.3-2.2-.8-4.3-1.7-6.4-1.1-2.7-2.7-5.1-4.8-7.1-.8-.8-1.6-1.5-2.5-2.2l-2.3-1.5c-.7-.5-1.6-.9-2.4-1.2-2.8-1.2-5.8-1.8-8.8-1.8-3.1
									0-6 .6-8.8 1.8-.6.2-1.2.5-1.8.8-.1.8 0 1.5 0 2.1zm24-3.7c1.7 1 3.2 2.2
									4.6 3.7 2.3 2.3 4.1 5 5.4 8.1 1 2.4 1.6 4.8 1.9 7.3 1.7-1.3 3.3-2.8
									4.6-4.6 1.7-2.4 3-5 3.8-7.8.5-1.9.7-3.9.7-5.8 0-.9
									0-1.9-.1-2.9-.4-2.9-1.3-5.8-2.9-8.4-1.5-2.7-3.5-5-6-6.8-.5-.3-1-.7-1.6-1-.6.3-1.1.7-1.7
									1.1-2.4 1.8-4.3 4.1-5.8 6.7-1.5 2.7-2.5 5.5-3 8.5.2.6.1 1.3.1 1.9z" class="astro-KHCKDDQM"></path>
        </svg>
      </div>
      <div class="astro-KHCKDDQM">Security Knowledge Framework</div>
    </div>
  </header><div class="wrapper astro-KHCKDDQM">
    <h2 class="astro-KHCKDDQM">LIVE DEMONSTRATION!</h2>
    <main class="astro-KHCKDDQM">
      <h1 class="astro-KHCKDDQM">${labName}</h1>
      <div class="form astro-KHCKDDQM">
        <input type="text" class="astro-KHCKDDQM">
        <button class="astro-KHCKDDQM">Submit</button>
      </div>
      <div class="flag astro-KHCKDDQM"></div>
    </main>
  </div>`,
        }
      )
    );
  }
);

const $$file$8 =
  "/workspaces/skf-examination-platform/src/pages/lab-sandbox-sample.astro";
const $$url$8 = "/lab-sandbox-sample";

const _page1 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$LabSandboxSample,
      file: $$file$8,
      url: $$url$8,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const $$Astro$d = createAstro(
  "/workspaces/skf-examination-platform/src/components/dashboard/DashboardHeader.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$DashboardHeader = createComponent(
  async ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
    Astro2.self = $$DashboardHeader;
    const name = "John";
    const { lab } = Astro2.props;
    const lastLab = { ...lab, url: `/labs/${lab.id}` };
    const userProgress = {
      labs: 15,
      hours: 10,
      quizzes: 45,
      certificates: 1,
    };
    return renderTemplate`${maybeRenderHead(
      $$result
    )}<div class="dashboard-header astro-CU2NTNTJ">
  <div class="welcome astro-CU2NTNTJ">
    <p class="greetings astro-CU2NTNTJ">Hi, ${name}</p>
    <p class="dashboard-info astro-CU2NTNTJ">
      Welcome to the new "Dashboard" here at the SKF examination platform. This
      will be your hub to all the labs we offer and your learning progress.
      <br class="astro-CU2NTNTJ">
      <br class="astro-CU2NTNTJ">
      We hope you will continue to learn with us.
    </p>
    <div class="links astro-CU2NTNTJ">
      <a class="btn astro-CU2NTNTJ"${addAttribute(
        lastLab.url,
        "href"
      )}>Continue ${lastLab.name}</a>
      <a class="btn astro-CU2NTNTJ" href="/labs">Browse Labs</a>
    </div>
  </div>

  <div class="goals-wrapper astro-CU2NTNTJ">
    <p class="astro-CU2NTNTJ">Personal Achievements!</p>
    <div class="goals astro-CU2NTNTJ">
      ${Object.keys(userProgress).map(
        (key) => renderTemplate`<div class="goal astro-CU2NTNTJ">
            <div class="title astro-CU2NTNTJ">${key}</div>
            <div class="value astro-CU2NTNTJ">${userProgress[key]}</div>
            <div class="line astro-CU2NTNTJ"></div>
          </div>`
      )}
    </div>
  </div>
</div>

`;
  }
);

const $$Astro$c = createAstro(
  "/workspaces/skf-examination-platform/src/components/svgs/Lab.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Lab$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Lab$1;
  return renderTemplate`${maybeRenderHead(
    $$result
  )}<svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5.32837 3.92059V1.87943H5.77115V0.993896H2.22894V1.87943H2.67172V3.92059L0.0770481 8.29513C0.0371907 8.36236 0.0158361 8.43893 0.0151536 8.51708C0.0144711 8.59522 0.034485 8.67216 0.0731623 8.74007C0.11184 8.80798 0.167802 8.86444 0.235365 8.90372C0.302928 8.943 0.379684 8.9637 0.457836 8.96371H7.54225C7.6204 8.9637 7.69716 8.943 7.76472 8.90372C7.83229 8.86444 7.88825 8.80798 7.92693 8.74007C7.9656 8.67216 7.98562 8.59522 7.98494 8.51708C7.98425 8.43893 7.9629 8.36236 7.92304 8.29513L5.32837 3.92059ZM3.46871 4.31022C3.52619 4.23358 3.55727 4.14037 3.55727 4.04456V1.87943H4.44282V4.04456C4.44284 4.12403 4.46426 4.20203 4.50481 4.27038L5.45235 5.86434H2.54774L3.46871 4.31022Z" fill="white"></path>
</svg>`;
});

const $$Astro$b = createAstro(
  "/workspaces/skf-examination-platform/src/components/dashboard/DashboardRecommend.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$DashboardRecommend = createComponent(
  async ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
    Astro2.self = $$DashboardRecommend;
    const { labs } = Astro2.props;
    const labsRecommended = labs.map((lab) => {
      return { ...lab, url: `/labs/${lab.id}` };
    });
    return renderTemplate`${maybeRenderHead(
      $$result
    )}<section class="astro-6RUJRWNA">
  <h3 class="astro-6RUJRWNA">Recommended For You</h3>
  <div class="recomendations astro-6RUJRWNA">
    ${labsRecommended.map(
      (lab) => renderTemplate`<div class="recomendation astro-6RUJRWNA">
          <div class="icon-wrapper astro-6RUJRWNA">
            <div class="flask-icon astro-6RUJRWNA">
              ${renderComponent($$result, "FlaskIcon", $$Lab$1, {
                class: "astro-6RUJRWNA",
              })}
            </div>
          </div>
          <div class="info astro-6RUJRWNA">
            <p class="level astro-6RUJRWNA">Level ${lab.level}</p>
            <p class="name astro-6RUJRWNA">${lab.name}</p>
            <p class="description astro-6RUJRWNA">${
              lab.description.slice(0, 64) + "..."
            }</p>
            <a${addAttribute(lab.url, "href")} class="astro-6RUJRWNA">Start</a>
          </div>
        </div>`
    )}
  </div>
</section>

`;
  }
);

/* src/components/dashboard/Matrix.svelte generated by Svelte v3.53.1 */

const css$5 = {
  code: ".wrapper.svelte-swz8t4{margin-bottom:2rem}h3.svelte-swz8t4{text-align:left;margin-bottom:2rem}canvas.svelte-swz8t4{width:100%;height:100%;border-radius:1rem;box-shadow:0 0 1rem 0 rgba(0, 0, 0, 0.1)}",
  map: null,
};

const Matrix = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let chart;

  $$result.css.add(css$5);

  return `<div class="${"wrapper svelte-swz8t4"}"><h3 class="${"svelte-swz8t4"}">Your progress</h3>
  <canvas id="${"myChart"}" class="${"svelte-swz8t4"}"${add_attribute(
    "this",
    chart,
    0
  )}></canvas>
</div>`;
});

async function getAllLabs(useCache = true) {
  return await _getAllLabs(void 0, useCache);
}
async function getAllLabsSSR(context, useCache = true) {
  return await _getAllLabs(context, useCache);
}
async function _getAllLabs(context, useCache = true) {
  const supabase = await getSupabase(context);
  const { data, error } = await supabase.from("labs").select("*");
  if (!error) return data;
  return [];
}

const $$Astro$a = createAstro(
  "/workspaces/skf-examination-platform/src/pages/dashboard.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const labs = await getAllLabs();
  const isLoggedin = await checkSession(Astro2);
  if (!isLoggedin) return Astro2.redirect("/login");
  return renderTemplate`${renderComponent(
    $$result,
    "BaseLayout",
    $$BaseLayout,
    { title: "SKF | Dashboard", isLoggedin: isLoggedin },
    {
      default: () => renderTemplate`${maybeRenderHead(
        $$result
      )}<div class="wrapper">
    ${renderComponent($$result, "DashboardHeader", $$DashboardHeader, {
      lab: labs[5],
    })}
    <!-- <DashboardLabs /> -->
    ${renderComponent($$result, "DashboardRecommend", $$DashboardRecommend, {
      labs: labs.slice(0, 4),
    })}
    ${renderComponent($$result, "Matrix", Matrix, {
      "client:load": true,
      "client:component-hydration": "load",
      "client:component-path":
        "/workspaces/skf-examination-platform/src/components/dashboard/Matrix.svelte",
      "client:component-export": "default",
    })}
  </div>`,
    }
  )}`;
});

const $$file$7 =
  "/workspaces/skf-examination-platform/src/pages/dashboard.astro";
const $$url$7 = "/dashboard";

const _page2 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$Dashboard,
      file: $$file$7,
      url: $$url$7,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

/* src/components/svgs/GitHub.svelte generated by Svelte v3.53.1 */

const GitHub = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="${"21"}" height="${"21"}" viewBox="${"0 0 21 21"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M10.5 0.989502C4.97768 0.989502 0.5 5.58325 0.5 11.244C0.5 15.7752 3.36607 19.6145 7.33929 20.9716C7.39502 20.9837 7.4519 20.9897 7.50893 20.9895C7.87946 20.9895 8.02232 20.7172 8.02232 20.4806C8.02232 20.235 8.01339 19.5922 8.00893 18.735C7.67814 18.8126 7.33974 18.853 7 18.8556C5.07589 18.8556 4.63839 17.36 4.63839 17.36C4.18304 16.177 3.52679 15.86 3.52679 15.86C2.65625 15.2484 3.52232 15.2306 3.58929 15.2306H3.59375C4.59821 15.3199 5.125 16.2931 5.125 16.2931C5.625 17.1681 6.29464 17.4136 6.89286 17.4136C7.28841 17.4057 7.67784 17.3144 8.03571 17.1457C8.125 16.485 8.38393 16.0341 8.66964 15.7752C6.45089 15.5163 4.11607 14.6368 4.11607 10.7082C4.11607 9.58771 4.50446 8.67253 5.14286 7.95825C5.04018 7.69932 4.69643 6.65468 5.24107 5.24396C5.31413 5.22648 5.38921 5.21897 5.46429 5.22164C5.82589 5.22164 6.64286 5.36004 7.99107 6.29754C9.62926 5.83919 11.3618 5.83919 13 6.29754C14.3482 5.36004 15.1652 5.22164 15.5268 5.22164C15.6019 5.21897 15.6769 5.22648 15.75 5.24396C16.2946 6.65468 15.9509 7.69932 15.8482 7.95825C16.4866 8.677 16.875 9.59218 16.875 10.7082C16.875 14.6457 14.5357 15.5118 12.308 15.7663C12.6652 16.0832 12.9866 16.7082 12.9866 17.6636C12.9866 19.0341 12.9732 20.1413 12.9732 20.4761C12.9732 20.7172 13.1116 20.9895 13.4821 20.9895C13.5421 20.9898 13.602 20.9838 13.6607 20.9716C17.6384 19.6145 20.5 15.7707 20.5 11.244C20.5 5.58325 16.0223 0.989502 10.5 0.989502Z"}" fill="${"white"}"></path></svg>`;
});

/* src/components/svgs/Google.svelte generated by Svelte v3.53.1 */

const Google = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="${"21"}" height="${"21"}" viewBox="${"0 0 21 21"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M20.3227 9.18739C20.4417 9.85857 20.501 10.5386 20.5 11.2198C20.5 14.2622 19.3906 16.8346 17.4599 18.5758H17.4625C15.7742 20.1045 13.4533 20.9895 10.7015 20.9895C7.99587 20.9895 5.40109 19.936 3.48794 18.0607C1.5748 16.1854 0.5 13.6419 0.5 10.9898C0.5 8.33775 1.5748 5.7943 3.48794 3.919C5.40109 2.0437 7.99587 0.990162 10.7015 0.990162C13.2339 0.96109 15.6796 1.89367 17.5263 3.59258L14.6137 6.44748C13.5609 5.46373 12.1558 4.92502 10.7015 4.94753C8.04016 4.94753 5.77926 6.70747 4.97335 9.07739C4.54604 10.3192 4.54604 11.6642 4.97335 12.906H4.97717C5.78691 15.2722 8.04399 17.0321 10.7053 17.0321C12.0799 17.0321 13.2608 16.6871 14.1764 16.0772H14.1725C14.7042 15.7319 15.1589 15.2847 15.5094 14.7624C15.8598 14.2402 16.0987 13.6537 16.2115 13.0385H10.7015V9.18864H20.3227V9.18739Z"}" fill="${"white"}"></path></svg>`;
});

/* src/components/svgs/LogoSvelte.svelte generated by Svelte v3.53.1 */

const LogoSvelte = create_ssr_component(
  ($$result, $$props, $$bindings, slots) => {
    return `<svg width="${"33"}" height="${"37"}" viewBox="${"0 0 33 37"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M16.5426 36.9895L16.2447 36.8193C15.8617 36.6065 15.4362 36.3512 15.0532 36.0533C13.9043 35.2022 12.9255 34.1384 12.2447 32.8618C11.5213 31.5852 11.0532 30.2235 10.8404 28.7767C10.8404 28.649 10.7979 28.5639 10.7979 28.4363C10.7128 28.4788 10.6277 28.5214 10.5 28.5639C9.18085 29.1171 7.73404 29.415 6.28723 29.415C4.79787 29.415 3.39362 29.1171 2.03191 28.5639C1.60638 28.3937 1.2234 28.181 0.840426 27.9682L0.5 27.798V27.415C0.5 26.9469 0.542553 26.5214 0.585106 26.0958C0.797872 24.6065 1.26596 23.2448 1.98936 21.9682C2.71277 20.6916 3.64894 19.5852 4.84043 18.7341C4.92553 18.649 5.01064 18.6065 5.09574 18.5214C5.01064 18.4363 4.92553 18.3937 4.79787 18.3086C3.64894 17.4576 2.67021 16.3512 1.98936 15.1171C1.2234 13.8405 0.755319 12.4788 0.585106 11.032V10.9895C0.542553 10.5214 0.5 10.0533 0.5 9.62776V9.24479L0.797872 9.07457C1.2234 8.81925 1.60638 8.60649 2.03191 8.47883C3.39362 7.92564 4.79787 7.62776 6.28723 7.62776C7.7766 7.62776 9.18085 7.92564 10.5 8.47883C10.5851 8.52138 10.6702 8.56393 10.7979 8.60649C10.7979 8.52138 10.7979 8.39372 10.8404 8.30861C11.0532 6.86181 11.5213 5.5001 12.2447 4.22351C12.9255 2.94691 13.9043 1.84053 15.0532 0.946912C15.4787 0.64904 15.8617 0.436274 16.2447 0.180955L16.5426 0.0107422L16.883 0.223508C17.2234 0.436274 17.5638 0.64904 17.9468 0.904359C19.1383 1.79798 20.117 2.90436 20.8404 4.18096C21.5638 5.45755 22.0319 6.81925 22.2021 8.26606C22.2021 8.39372 22.2021 8.47883 22.2447 8.60649C22.3298 8.56393 22.4574 8.52138 22.5426 8.47883C23.8617 7.92564 25.3085 7.62776 26.7553 7.62776C28.2447 7.62776 29.6489 7.92564 30.9681 8.47883C31.3936 8.64904 31.8191 8.86181 32.2021 9.11713L32.5 9.28734V9.62776C32.5 10.0533 32.5 10.4788 32.4574 10.9469V10.9895C32.2447 12.4363 31.8192 13.8405 31.0957 15.0746C30.3298 16.3512 29.3936 17.415 28.2021 18.3086C28.117 18.3937 28.0319 18.4363 27.9468 18.5214C28.0319 18.6065 28.117 18.649 28.2021 18.7341C29.3511 19.5852 30.3298 20.6916 31.0532 21.9682C31.7766 23.2448 32.2447 24.6065 32.4149 26.0958C32.4574 26.5639 32.4574 26.9895 32.4574 27.415V27.798L32.1596 27.9682C31.7766 28.181 31.3936 28.3937 30.9681 28.5639C29.6489 29.1171 28.2447 29.415 26.7553 29.415C25.266 29.415 23.8617 29.1171 22.5 28.5639C22.4149 28.5214 22.2872 28.4788 22.2021 28.4363C22.2021 28.5214 22.2021 28.649 22.1596 28.7341C21.9894 30.181 21.5213 31.5852 20.7979 32.8618C20.0745 34.1384 19.0957 35.2448 17.9043 36.0959C17.5638 36.3937 17.1809 36.649 16.7979 36.8618L16.5426 36.9895ZM12.0319 27.3724C12.0319 27.7554 12.0319 28.181 12.0745 28.5639C12.2447 29.798 12.6702 31.032 13.3511 32.181C13.9894 33.2873 14.7979 34.2661 15.8191 34.9895C16.0745 35.1597 16.2872 35.3299 16.5 35.5001C16.7128 35.3724 16.9255 35.2022 17.1383 35.032C18.2021 34.2661 19.0532 33.3299 19.6915 32.181C20.3298 31.032 20.7553 29.798 20.9255 28.5639C20.9681 28.3086 20.9681 28.0107 20.9681 27.7554C20.2872 27.3299 19.6489 26.8193 19.0532 26.2235C18.0319 25.2448 17.2234 24.0533 16.7128 22.7767C16.2872 21.798 16.0319 20.7341 15.9468 19.6703C15.1809 20.2235 14.5426 20.8618 13.9468 21.6278C13.2234 22.6065 12.6702 23.7129 12.3723 24.9044C12.1596 25.7129 12.0319 26.5639 12.0319 27.3724ZM21.9468 26.8193C22.2872 26.9895 22.6702 27.2022 23.0532 27.3299C24.2447 27.8405 25.5213 28.0958 26.7979 28.0958C28.0745 28.0958 29.3511 27.8405 30.5 27.3299C30.7553 27.2022 31.0106 27.1171 31.2234 26.9895C31.2234 26.6916 31.2234 26.4363 31.1809 26.1384C31.0106 24.9044 30.5851 23.6703 29.9468 22.5214C29.3085 21.3724 28.4574 20.4363 27.4362 19.6703C27.2234 19.5001 26.9681 19.3299 26.7553 19.1597C26.0319 19.5427 25.266 19.8405 24.4574 20.0533C23.0957 20.4363 21.6915 20.5214 20.2872 20.3512C19.2234 20.2235 18.2021 19.9256 17.2234 19.5001C17.3085 20.4363 17.5638 21.3299 17.9043 22.181C18.3723 23.3299 19.0957 24.3512 19.9894 25.2022C20.5851 25.8831 21.266 26.3937 21.9468 26.8193ZM1.7766 26.9895C2.03191 27.1171 2.28723 27.2448 2.54255 27.3299C3.73404 27.8405 4.96809 28.0958 6.28723 28.0958C7.56383 28.0958 8.84043 27.8405 10.0319 27.3299C10.2872 27.2022 10.5426 27.1171 10.7979 26.9895C10.8404 26.1384 10.9681 25.3299 11.1809 24.5214C11.5213 23.1597 12.1596 21.9256 12.9681 20.7767C13.6489 19.9256 14.4149 19.1597 15.266 18.5214C14.4149 18.1384 13.5213 17.8831 12.6277 17.798C11.3936 17.6703 10.1596 17.7129 8.92553 18.0107C8.15957 18.2235 7.39362 18.5639 6.62766 18.9895C6.28723 19.2022 5.94681 19.415 5.60638 19.6703C4.58511 20.4363 3.73404 21.3724 3.1383 22.5214C2.45745 23.6703 2.03191 24.8618 1.8617 26.181C1.81915 26.4788 1.7766 26.7341 1.7766 26.9895ZM17.8191 18.4363C18.6702 18.7767 19.5213 19.032 20.4574 19.1597C21.6915 19.3299 22.9255 19.2448 24.1596 18.9044C24.9255 18.7341 25.6489 18.4363 26.3298 18.0533L26.5 17.9682C26.7979 17.798 27.1383 17.5427 27.4787 17.3299C28.5 16.5639 29.3511 15.5852 30.0319 14.4788C30.6702 13.3724 31.0532 12.1384 31.2234 10.8618C31.2234 10.5639 31.266 10.2661 31.266 10.0107C31.0532 9.88308 30.7979 9.75542 30.5426 9.67032C29.3511 9.15968 28.117 8.90436 26.7979 8.90436C25.5213 8.90436 24.2447 9.15968 23.0532 9.67032C22.7979 9.75542 22.5426 9.88308 22.2872 10.0107C22.2447 10.8193 22.1596 11.6278 21.9468 12.4363C21.5638 13.798 20.9681 15.0746 20.117 16.2235C19.4362 17.0746 18.6702 17.798 17.8191 18.4363ZM1.81915 10.8193C1.98936 12.0958 2.41489 13.3299 3.09574 14.4363C3.73404 15.5427 4.58511 16.5214 5.60638 17.2873C5.81915 17.4576 6.07447 17.6278 6.32979 17.7554C7.05319 17.3724 7.81915 17.0746 8.58511 16.8193C9.98936 16.4788 11.3936 16.3937 12.7979 16.5639C13.8617 16.6916 14.9255 16.9895 15.9043 17.415C15.7766 16.4788 15.5638 15.5852 15.1809 14.6916C14.7128 13.5427 14.0319 12.5214 13.1383 11.6703C12.7979 11.3299 12.4574 11.032 12.0745 10.7341L11.0957 10.0958C10.7979 9.88308 10.4149 9.71287 10.0745 9.58521C8.88298 9.07457 7.60638 8.81925 6.32979 8.81925C5.01064 8.81925 3.7766 9.07457 2.58511 9.58521C2.32979 9.67032 2.07447 9.79798 1.81915 9.92564C1.7766 10.2661 1.81915 10.5639 1.81915 10.8193ZM12.0319 9.24479C12.7553 9.67032 13.3936 10.181 13.9894 10.8193C14.9681 11.798 15.734 12.9469 16.2872 14.2661C16.7128 15.2873 16.9681 16.3086 17.0957 17.3724C17.8191 16.8193 18.5 16.181 19.0532 15.415C19.7766 14.3937 20.3298 13.2873 20.6702 12.0958C20.883 11.2873 20.9681 10.4363 20.9681 9.62776C20.9681 9.24479 20.9681 8.81925 20.9255 8.39372C20.7553 7.15968 20.3723 5.92564 19.6915 4.81925C19.0532 3.67032 18.2021 2.69159 17.1383 1.92564C16.9255 1.79798 16.7128 1.62776 16.4574 1.5001C16.2021 1.62776 15.9894 1.79798 15.734 1.96819C14.7128 2.73415 13.9043 3.71287 13.266 4.81925C12.6277 5.96819 12.2021 7.15968 11.9894 8.43627C12.0745 8.69159 12.0319 8.98947 12.0319 9.24479Z"}" fill="${"white"}"></path></svg>`;
  }
);

/* src/components/RegisterAndLogin.svelte generated by Svelte v3.53.1 */

const css$4 = {
  code: ".form.svelte-fqqm33.svelte-fqqm33.svelte-fqqm33{display:flex;flex-direction:column;align-items:center;padding:2rem 3rem;gap:2rem;margin:auto;background-color:var(--primary-700);border-radius:1rem}.form.svelte-fqqm33 .title.svelte-fqqm33.svelte-fqqm33{display:flex;flex-direction:column;align-items:center;gap:0.25rem;font-size:1rem;font-weight:600}.form.svelte-fqqm33 form.svelte-fqqm33.svelte-fqqm33{display:flex;flex-direction:column;align-items:flex-end;gap:16px;width:100%}.form.svelte-fqqm33 form .btn.svelte-fqqm33.svelte-fqqm33{width:100%;background-color:var(--primary-400);color:var(--text-primary);margin-top:0.5rem}.form.svelte-fqqm33 form .btn.svelte-fqqm33.svelte-fqqm33:hover{background-color:var(--primary-500)}form.svelte-fqqm33 .item-input.svelte-fqqm33.svelte-fqqm33{display:flex;flex-direction:column;align-items:flex-start;gap:4px;width:100%}.item-input.svelte-fqqm33 label.svelte-fqqm33.svelte-fqqm33{font-family:var(--font-decoration);font-size:14px}.item-input.svelte-fqqm33 input.svelte-fqqm33.svelte-fqqm33{background:rgba(245, 245, 245, 0.1);border-radius:4px;height:32px;width:100%;border:none;padding:8px 8px;color:var(--text-primary)}input.btn.svelte-fqqm33.svelte-fqqm33.svelte-fqqm33{width:100%}.container-sign-with.svelte-fqqm33 .title.svelte-fqqm33.svelte-fqqm33{display:flex;flex-direction:row;align-items:center;gap:0.25rem}.container-sign-with.svelte-fqqm33 .title.svelte-fqqm33 p.svelte-fqqm33{min-width:-moz-fit-content;min-width:fit-content;color:var(--primary-300);text-align:center;font-size:12px}.container-sign-with.svelte-fqqm33 .title div.svelte-fqqm33.svelte-fqqm33{width:100%;height:0.5px;background-color:var(--primary-300)}.container-sign-with.svelte-fqqm33 .list-social.svelte-fqqm33.svelte-fqqm33{display:flex;flex-direction:row;gap:24px;margin:16px 0px}.list-social.svelte-fqqm33 .sign-with.svelte-fqqm33.svelte-fqqm33{width:100%;border-radius:0.25rem;display:flex;justify-content:center;padding:8px 16px}.list-social.svelte-fqqm33 .github.svelte-fqqm33.svelte-fqqm33{background-color:black}.list-social.svelte-fqqm33 .google.svelte-fqqm33.svelte-fqqm33{background-color:#db4437}.sign-in.svelte-fqqm33.svelte-fqqm33.svelte-fqqm33{display:flex;flex-direction:row;gap:0.5rem;align-items:center;justify-content:center;font-size:0.875rem;line-height:1.25rem}.sign-in.svelte-fqqm33 a.svelte-fqqm33.svelte-fqqm33{font-weight:600}a.svelte-fqqm33.svelte-fqqm33.svelte-fqqm33:hover{-webkit-text-decoration:underline var(--text-primary);text-decoration:underline var(--text-primary)}",
  map: null,
};

const RegisterAndLogin = create_ssr_component(
  ($$result, $$props, $$bindings, slots) => {
    let { mode } = $$props;
    let emailInput = "";
    let passwordInput = "";
    let passwordConfirmInput = "";

    if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0)
      $$bindings.mode(mode);
    $$result.css.add(css$4);

    return `<div class="${"form svelte-fqqm33"}"><div class="${"title svelte-fqqm33"}">${validate_component(
      LogoSvelte,
      "LogoSvelte"
    ).$$render($$result, {}, {}, {})}
    ${
      mode === "register"
        ? `<p class="${"svelte-fqqm33"}">Create an account.</p>`
        : `<p class="${"svelte-fqqm33"}">Sign in to your account.</p>`
    }</div>

  <form class="${"svelte-fqqm33"}"><div class="${"item-input svelte-fqqm33"}"><label for="${"email"}" class="${"svelte-fqqm33"}">Email:</label>
      <input type="${"email"}" id="${"email"}" class="${"svelte-fqqm33"}"${add_attribute(
      "value",
      emailInput,
      0
    )}></div>
    <div class="${"item-input svelte-fqqm33"}"><label for="${"password"}" class="${"svelte-fqqm33"}">Password:</label>
      <input type="${"password"}" id="${"password"}" class="${"svelte-fqqm33"}"${add_attribute(
      "value",
      passwordInput,
      0
    )}></div>
    ${
      mode === "register"
        ? `<div class="${"item-input svelte-fqqm33"}"><label for="${"confirmPassword"}" class="${"svelte-fqqm33"}">Confirm Password:</label>
        <input type="${"password"}" id="${"confirmPassword"}" class="${"svelte-fqqm33"}"${add_attribute(
            "value",
            passwordConfirmInput,
            0
          )}></div>`
        : `<a href="${"/"}" class="${"small-text svelte-fqqm33"}">Forgot Password?</a>`
    }
    <input class="${"btn svelte-fqqm33"}" type="${"submit"}"${add_attribute(
      "value",
      mode === "register" ? "Register" : "Login",
      0
    )}></form>
  ${``}
  ${``}

  <div class="${"container-sign-with svelte-fqqm33"}"><div class="${"title svelte-fqqm33"}"><div class="${"svelte-fqqm33"}"></div>
      <p class="${"svelte-fqqm33"}">Or sign up with</p>
      <div class="${"svelte-fqqm33"}"></div></div>
    <div class="${"list-social svelte-fqqm33"}"><button class="${"sign-with github svelte-fqqm33"}">${validate_component(
      GitHub,
      "GitHub"
    ).$$render($$result, {}, {}, {})}</button>
      <button class="${"sign-with google svelte-fqqm33"}">${validate_component(
      Google,
      "Google"
    ).$$render($$result, {}, {}, {})}</button></div>
    <svg height="${"10"}" width="${"100%"}"><line x1="${"0"}" y1="${"0"}" x2="${"100%"}" y2="${"0"}" style="${"stroke:var(--primary-300);stroke-width:2"}"></line></svg>
    ${
      mode === "register"
        ? `<div class="${"sign-in svelte-fqqm33"}"><p class="${"svelte-fqqm33"}">Have an account?</p>
        <a href="${"/login"}" class="${"svelte-fqqm33"}">Sign in</a></div>`
        : ``
    }</div>

  ${
    mode === "login"
      ? `<p class="${"small-text"}">Don’t have an account yet? <a href="${"/register"}" class="${"svelte-fqqm33"}">Sign up</a></p>`
      : ``
  }
</div>`;
  }
);

const $$Astro$9 = createAstro(
  "/workspaces/skf-examination-platform/src/components/svgs/Incognito.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Incognito = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Incognito;
  return renderTemplate`${maybeRenderHead(
    $$result
  )}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
  <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
  <path d="M224 16c-6.7 0-10.8-2.8-15.5-6.1C201.9 5.4 194 0 176 0c-30.5 0-52 43.7-66 89.4C62.7 98.1 32 112.2 32 128c0 14.3 25 27.1 64.6 35.9c-.4 4-.6 8-.6 12.1c0 17 3.3 33.2 9.3 48H45.4C38 224 32 230 32 237.4c0 1.7 .3 3.4 1 5l38.8 96.9C28.2 371.8 0 423.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7c0-58.5-28.2-110.4-71.7-143L415 242.4c.6-1.6 1-3.3 1-5c0-7.4-6-13.4-13.4-13.4H342.7c6-14.8 9.3-31 9.3-48c0-4.1-.2-8.1-.6-12.1C391 155.1 416 142.3 416 128c0-15.8-30.7-29.9-78-38.6C324 43.7 302.5 0 272 0c-18 0-25.9 5.4-32.5 9.9c-4.7 3.3-8.8 6.1-15.5 6.1zm56 208H267.6c-16.5 0-31.1-10.6-36.3-26.2c-2.3-7-12.2-7-14.5 0c-5.2 15.6-19.9 26.2-36.3 26.2H168c-22.1 0-40-17.9-40-40V169.6c28.2 4.1 61 6.4 96 6.4s67.8-2.3 96-6.4V184c0 22.1-17.9 40-40 40zm-88 96l16 32L176 480 128 288l64 32zm128-32L272 480 240 352l16-32 64-32z"></path>
</svg>`;
});

const $$Astro$8 = createAstro(
  "/workspaces/skf-examination-platform/src/components/register/Register.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Register$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Register$1;
  const benefits = [
    {
      title: "Lorem ipsum dolor sit",
      description:
        "Lorem ipsum dolor sit amet consectetur. Lobortis cursus orci.",
    },
    {
      title: "Lorem ipsum dolor sit",
      description:
        "Lorem ipsum dolor sit amet consectetur. Lobortis cursus orci.",
    },
    {
      title: "Lorem ipsum dolor sit",
      description:
        "Lorem ipsum dolor sit amet consectetur. Lobortis cursus orci.",
    },
  ];
  return renderTemplate`${maybeRenderHead(
    $$result
  )}<div class="content astro-JE6QG654">
  <div class="info astro-JE6QG654">
    <div class="main astro-JE6QG654">
      <h3 class="astro-JE6QG654">Security Knowledge Framework</h3>
      <ul class="astro-JE6QG654">
        ${benefits.map(
          (benefit) => renderTemplate`<li class="astro-JE6QG654">
              <div class="title astro-JE6QG654">
                <div class="icon astro-JE6QG654">
                  ${renderComponent($$result, "Incognito", $$Incognito, {
                    class: "astro-JE6QG654",
                  })}
                </div>
                <h4 class="astro-JE6QG654">${benefit.title}</h4>
              </div>
              <p class="astro-JE6QG654">${benefit.description}</p>
            </li>`
        )}
      </ul>

      <div class="footer astro-JE6QG654">
        <div class="info astro-JE6QG654">
          <a href="" class="astro-JE6QG654">Contact</a>
          <a href="" class="astro-JE6QG654">Terms of Service</a>
          <a href="" class="astro-JE6QG654">Privacy Policy</a>
        </div>
        <p class="small-text astro-JE6QG654">© 2022 Security Knowlegde Framework</p>
      </div>
    </div>
  </div>
  ${renderComponent($$result, "RegisterInput", RegisterAndLogin, {
    "client:load": true,
    mode: "register",
    "client:component-hydration": "load",
    "client:component-path":
      "/workspaces/skf-examination-platform/src/components/RegisterAndLogin.svelte",
    "client:component-export": "default",
    class: "astro-JE6QG654",
  })}
</div>

`;
});

const $$Astro$7 = createAstro(
  "/workspaces/skf-examination-platform/src/pages/register.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Register;
  const isLoggedin = await checkSession(Astro2);
  return renderTemplate`${renderComponent(
    $$result,
    "BaseLayout",
    $$BaseLayout,
    {
      title: "SKF | Register",
      loadNav: false,
      isLoggedin: isLoggedin,
      class: "astro-HNXLED7D",
    },
    {
      default: () =>
        renderTemplate`${renderComponent($$result, "Register", $$Register$1, {
          class: "astro-HNXLED7D",
        })}`,
    }
  )}

`;
});

const $$file$6 =
  "/workspaces/skf-examination-platform/src/pages/register.astro";
const $$url$6 = "/register";

const _page3 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$Register,
      file: $$file$6,
      url: $$url$6,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

/* src/components/svgs/User.svelte generated by Svelte v3.53.1 */

const css$3 = {
  code: ".background.svelte-ost4sw{fill:#ffffff}",
  map: null,
};

const User = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);

  return `
<svg version="${"1.1"}" xmlns="${"http://www.w3.org/2000/svg"}" xmlns:xlink="${"http://www.w3.org/1999/xlink"}" x="${"0px"}" y="${"0px"}" viewBox="${"0 0 448 512"}" style="${"enable-background:new 0 0 448 512;"}" xml:space="${"preserve"}"><path class="${"background svelte-ost4sw"}" d="${"M224,34.8C101.8,34.8,2.8,133.8,2.8,256c0,54.5,19.7,104.3,52.3,142.9C69.3,338.2,123.8,293,188.8,293h70.4\n\t\tc65,0,119.5,45.2,133.7,105.9c32.6-38.5,52.3-88.4,52.3-142.9C445.2,133.8,346.2,34.8,224,34.8z M224,256\n\t\tc-54.5,0-98.6-44.1-98.6-98.6s44.1-98.6,98.6-98.6s98.6,44.1,98.6,98.6S278.5,256,224,256z"}"></path><g><circle cx="${"224"}" cy="${"157.4"}" r="${"98.6"}"></circle><path d="${"M392.9,398.9c-18.9,22.3-42.2,40.9-68.5,54.3c-30.1,15.4-64.3,24.1-100.4,24.1s-70.3-8.7-100.4-24.1\n\t\t\tc-26.3-13.4-49.6-32-68.5-54.3C69.3,338.2,123.8,293,188.8,293h70.4C324.2,293,378.7,338.2,392.9,398.9z"}"></path></g></svg>`;
});

/* src/components/profile/Profile.svelte generated by Svelte v3.53.1 */

const css$2 = {
  code: "section.svelte-1s8gvoz{display:grid;grid-template-columns:1fr 2fr;grid-gap:1rem;background-color:var(--primary-700);padding:3.5rem 1.5rem;border-radius:0.5rem;align-items:center}.avatar.svelte-1s8gvoz{width:120px;height:120px;display:flex}.info.svelte-1s8gvoz{display:flex;flex-direction:column;align-items:center;gap:0.5rem}h1.svelte-1s8gvoz{font-size:1.5rem}.email.svelte-1s8gvoz{font-size:0.8rem;color:var(--primary-00)}.form.svelte-1s8gvoz{display:grid;grid-template-columns:1fr 2fr;grid-gap:1.5rem}label.svelte-1s8gvoz{font-size:0.8rem}.submit.svelte-1s8gvoz{grid-column:1 / 3;justify-self:end}",
  map: null,
};

const Profile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isLoggedin = false } = $$props;
  if (
    $$props.isLoggedin === void 0 &&
    $$bindings.isLoggedin &&
    isLoggedin !== void 0
  )
    $$bindings.isLoggedin(isLoggedin);
  $$result.css.add(css$2);

  return `${
    isLoggedin
      ? `<section class="${"svelte-1s8gvoz"}"><div class="${"info svelte-1s8gvoz"}"><div class="${"avatar svelte-1s8gvoz"}">${validate_component(
          User,
          "User"
        ).$$render($$result, {}, {}, {})}</div>
      <h1 class="${"svelte-1s8gvoz"}">Jane Smith</h1>
      <p class="${"email svelte-1s8gvoz"}">jane@smith.com</p></div>
    <div class="${"form svelte-1s8gvoz"}">
      <label for="${"name"}" class="${"svelte-1s8gvoz"}">Name</label>
      <input type="${"text"}" name="${"name"}" id="${"name"}">
      
      <label for="${"email"}" class="${"svelte-1s8gvoz"}">Email</label>
      <input type="${"email"}" name="${"email"}" id="${"email"}">
      
      <label for="${"password"}" class="${"svelte-1s8gvoz"}">Password</label>
      <input type="${"password"}" name="${"password"}" id="${"password"}">
      
      <label for="${"confirm-password"}" class="${"svelte-1s8gvoz"}">Confirm Password</label>
      <input type="${"password"}" name="${"confirm-password"}" id="${"confirm-password"}">
      <button class="${"submit svelte-1s8gvoz"}" type="${"submit"}">Save</button></div></section>`
      : ``
  }`;
});

const $$Astro$6 = createAstro(
  "/workspaces/skf-examination-platform/src/pages/profile.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Profile;
  const isLoggedin = await checkSession(Astro2);
  if (!isLoggedin) return Astro2.redirect("/login");
  return renderTemplate`${renderComponent(
    $$result,
    "BaseLayout",
    $$BaseLayout,
    { title: "SKF | Profile", isLoggedin: isLoggedin },
    {
      default: () => renderTemplate`${maybeRenderHead(
        $$result
      )}<div class="wrapper">
    ${renderComponent($$result, "Profile", Profile, {
      "client:load": true,
      isLoggedin: isLoggedin,
      "client:component-hydration": "load",
      "client:component-path":
        "/workspaces/skf-examination-platform/src/components/profile/Profile.svelte",
      "client:component-export": "default",
    })}
  </div>`,
    }
  )}`;
});

const $$file$5 = "/workspaces/skf-examination-platform/src/pages/profile.astro";
const $$url$5 = "/profile";

const _page4 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$Profile,
      file: $$file$5,
      url: $$url$5,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const $$Astro$5 = createAstro(
  "/workspaces/skf-examination-platform/src/components/module/Module.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Module = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Module;
  const { certificate, labs } = Astro2.props;
  return renderTemplate`${maybeRenderHead(
    $$result
  )}<div class="wrapper astro-5MBDWBSX">
  <header class="astro-5MBDWBSX">
    <img src="/imgs/skf-certificate.jpg" alt="" class="astro-5MBDWBSX">
    <div class="info astro-5MBDWBSX">
      <h3 class="astro-5MBDWBSX">${certificate.name}</h3>
      <p class="astro-5MBDWBSX">
        ${certificate.description}
      </p>
      <a${addAttribute(
        `/labs/${labs[0].id}`,
        "href"
      )} class="btn astro-5MBDWBSX">Start now</a>
    </div>
  </header>

  <main class="astro-5MBDWBSX">
    <div class="content astro-5MBDWBSX">
      <h4 class="astro-5MBDWBSX">Summary</h4>
      <div class="summary astro-5MBDWBSX">
        <p class="astro-5MBDWBSX">${certificate.summary.description}</p>
        <ul class="astro-5MBDWBSX">
          ${certificate.summary.list.map(
            (item) => renderTemplate`<li class="astro-5MBDWBSX">${item}</li>`
          )}
        </ul>
        <p class="astro-5MBDWBSX">${certificate.summary.footer}</p>
      </div>
    </div>
    <div class="sidebar astro-5MBDWBSX">
      <div class="labs astro-5MBDWBSX">
        <h4 class="astro-5MBDWBSX">Modules</h4>
        ${labs.map(
          (lab) => renderTemplate`<div class="lab astro-5MBDWBSX">
              ${renderComponent($$result, "FlaskIcon", $$Lab$1, {
                class: "astro-5MBDWBSX",
              })}
              <a${addAttribute(
                `/labs/${lab.id}`,
                "href"
              )} class="astro-5MBDWBSX">${lab.name}</a>
            </div>`
        )}
      </div>
    </div>
  </main>
</div>

`;
});

const $$Astro$4 = createAstro(
  "/workspaces/skf-examination-platform/src/pages/module/[id].astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$id$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$id$1;
  const { id } = Astro2.params;
  const certificate = certificates.find(
    (certificate2) => certificate2.name == id
  );
  const labs = (await getAllLabsSSR(Astro2)).slice(0, 10);
  const isLoggedin = await checkSession(Astro2);
  if (!certificate) {
    return new Response(null, {
      status: 404,
    });
  }
  const { name } = certificate;
  return renderTemplate`${renderComponent(
    $$result,
    "BaseLayout",
    $$BaseLayout,
    { title: `SKF | LAB - ${name}`, isLoggedin: isLoggedin },
    {
      default: () =>
        renderTemplate`${renderComponent($$result, "Module", $$Module, {
          certificate: certificate,
          labs: labs,
        })}`,
    }
  )}`;
});

const $$file$4 =
  "/workspaces/skf-examination-platform/src/pages/module/[id].astro";
const $$url$4 = "/module/[id]";

const _page5 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$id$1,
      file: $$file$4,
      url: $$url$4,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const $$Astro$3 = createAstro(
  "/workspaces/skf-examination-platform/src/pages/login.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Login;
  const isLoggedin = await checkSession(Astro2);
  if (isLoggedin) return Astro2.redirect("/dashboard");
  return renderTemplate`${renderComponent(
    $$result,
    "BaseLayout",
    $$BaseLayout,
    {
      title: "SKF | Login",
      loadNav: false,
      isLoggedin: isLoggedin,
      class: "astro-BK2ITVW3",
    },
    {
      default: () => renderTemplate`${maybeRenderHead(
        $$result
      )}<div class="wrapper astro-BK2ITVW3">
    ${renderComponent($$result, "FormLogin", RegisterAndLogin, {
      "client:load": true,
      mode: "login",
      "client:component-hydration": "load",
      "client:component-path":
        "/workspaces/skf-examination-platform/src/components/RegisterAndLogin.svelte",
      "client:component-export": "default",
      class: "astro-BK2ITVW3",
    })}
  </div>`,
    }
  )}

`;
});

const $$file$3 = "/workspaces/skf-examination-platform/src/pages/login.astro";
const $$url$3 = "/login";

const _page6 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$Login,
      file: $$file$3,
      url: $$url$3,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const $$Astro$2 = createAstro(
  "/workspaces/skf-examination-platform/src/pages/labs/index.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Index;
  const isLoggedin = await checkSession(Astro2);
  const labs = await getAllLabs();
  return renderTemplate`${renderComponent(
    $$result,
    "BaseLayout",
    $$BaseLayout,
    {
      title: "SKF | ALL LABS",
      isLoggedin: isLoggedin,
      class: "astro-FO4TYHZA",
    },
    {
      default: () => renderTemplate`${maybeRenderHead(
        $$result
      )}<div class="wrapper astro-FO4TYHZA">
    <h1 class="astro-FO4TYHZA">LABS</h1>

    <div class="filters astro-FO4TYHZA">
      <input type="text" placeholder="Search Lab" class="astro-FO4TYHZA">

      <div class="show astro-FO4TYHZA">
        <p class="astro-FO4TYHZA">Show</p>
        <select name="" id="" class="astro-FO4TYHZA">
          <option value="5" class="astro-FO4TYHZA">5</option>
          <option value="10" class="astro-FO4TYHZA">10</option>
          <option value="25" class="astro-FO4TYHZA">25</option>
          <option value="100" class="astro-FO4TYHZA">100</option>
        </select>
      </div>
    </div>
    <table class="astro-FO4TYHZA">
      <tr class="astro-FO4TYHZA"><th class="astro-FO4TYHZA">#</th><th class="astro-FO4TYHZA">Lab Name</th><th class="astro-FO4TYHZA">Level</th><th class="astro-FO4TYHZA">Description</th><th class="astro-FO4TYHZA">Detail</th>
      </tr>
      ${labs.map(
        (lab) => renderTemplate`<tr class="astro-FO4TYHZA">
            <td class="astro-FO4TYHZA">${lab.id}</td>
            <td class="astro-FO4TYHZA">${lab.name}</td>
            <td class="td-icon astro-FO4TYHZA">
              <div class="circle astro-FO4TYHZA">${lab.level}</div>
            </td>
            <td class="astro-FO4TYHZA">${
              lab.description.slice(0, 64) + "..."
            }</td>
            <td class="td-icon astro-FO4TYHZA">
              <a${addAttribute(
                `/labs/${lab.id}`,
                "href"
              )} class="astro-FO4TYHZA">
                <div class="circle astro-FO4TYHZA">
                  ${renderComponent($$result, "Lab", $$Lab$1, {
                    class: "astro-FO4TYHZA",
                  })}
                </div>
              </a>
            </td>
          </tr>`
      )}
    
  </table>
</div>`,
    }
  )}`;
});

const $$file$2 =
  "/workspaces/skf-examination-platform/src/pages/labs/index.astro";
const $$url$2 = "/labs";

const _page7 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$Index,
      file: $$file$2,
      url: $$url$2,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

function cubicOut(t) {
  const f = t - 1.0;
  return f * f * f + 1.0;
}

function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}

function get_interpolator(a, b) {
  if (a === b || a !== a) return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b) throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set((value = new_value));
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = identity,
      interpolate = get_interpolator,
    } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set((value = target_value));
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now) => {
      if (now < start) return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now - start;
      if (elapsed > duration) {
        store.set((value = new_value));
        return false;
      }
      // @ts-ignore
      store.set((value = fn(easing(elapsed / duration))));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe,
  };
}

const labStore = writable({ "write-up": false, quizz: false });

/* src/components/lab-sandbox/Progress.svelte generated by Svelte v3.53.1 */

const css$1 = {
  code: "label.svelte-os91lh{display:inline-block;width:180px}",
  map: null,
};

const duration = 1000;

const Progress = create_ssr_component(
  ($$result, $$props, $$bindings, slots) => {
    let $$unsubscribe_labStore;
    let $progress, $$unsubscribe_progress;
    $$unsubscribe_labStore = subscribe(labStore, (value) => value);
    const progress = tweened(0, { duration, easing: cubicOut });
    $$unsubscribe_progress = subscribe(
      progress,
      (value) => ($progress = value)
    );
    let finishedLab = false;

    labStore.subscribe((lab) => {
      if (finishedLab) return;
      if (lab["write-up"] || lab.quizz)
        set_store_value(progress, ($progress = 50), $progress);

      if (lab["write-up"] && lab.quizz) {
        set_store_value(progress, ($progress = 100), $progress);
        finishedLab = true;
      }
    });

    $$result.css.add(css$1);
    $$unsubscribe_labStore();
    $$unsubscribe_progress();

    return `<div class="${"progress"}"><label for="${"lab-progress"}" class="${"svelte-os91lh"}">Lab progress: ${escape(
      $progress.toFixed()
    )}/100</label>
  <progress id="${"lab-progress"}"${add_attribute(
      "value",
      $progress,
      0
    )} max="${"100"}">${escape($progress)}/100</progress>
</div>`;
  }
);

/* src/components/lab-sandbox/Quizzes.svelte generated by Svelte v3.53.1 */

const css = {
  code: "#quizzes.svelte-9p6jz1{display:flex;flex-direction:column;align-items:flex-start;padding-bottom:2rem;position:relative}.input-lab-flag.svelte-9p6jz1{margin-bottom:2rem}li.svelte-9p6jz1{list-style:none;display:flex;flex-direction:column;margin-bottom:1.5rem;align-items:flex-start;gap:0.5rem}button.svelte-9p6jz1{margin-bottom:2rem}.message.svelte-9p6jz1{position:absolute;bottom:0;left:0}",
  map: null,
};

const Quizzes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_labStore;
  $$unsubscribe_labStore = subscribe(labStore, (value) => value);
  let { quizzes = [] } = $$props;
  let flag = "";

  quizzes = quizzes.map((quiz) => {
    return { ...quiz, answer: "" };
  });

  if ($$props.quizzes === void 0 && $$bindings.quizzes && quizzes !== void 0)
    $$bindings.quizzes(quizzes);
  $$result.css.add(css);
  $$unsubscribe_labStore();

  return `<div id="${"quizzes"}" class="${"svelte-9p6jz1"}"><ul>${each(
    quizzes,
    (quiz) => {
      return `<li class="${"svelte-9p6jz1"}"><h4>${escape(quiz.title)}</h4>
        <p>${escape(quiz.description)}</p>
        <input type="${"text"}"${add_attribute("value", quiz.answer, 0)}>
      </li>`;
    }
  )}</ul>
  <p>Lab Flag</p>
  <input class="${"input-lab-flag svelte-9p6jz1"}" type="${"text"}"${add_attribute(
    "value",
    flag,
    0
  )}>
  <button class="${"svelte-9p6jz1"}">Submit</button>
  ${``}
</div>`;
});

function createCodeMirror(props, ref) {
  const [getValue, setValue] = createSignal(props.value);
  const [getView, setView] = createSignal(null);
  const [getState, setState] = createSignal(null);
  createEffect(
    on(
      getValue,
      (val) => {
        const view = getView();
        if (!view || val === view.state.doc.toString()) {
          return;
        }
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: val,
          },
        });
      },
      { defer: true }
    )
  );
  createEffect(
    on(
      () => getView()?.state,
      () => {
        const view = getView();
        if (!view) return;
        setState(view.state);
      },
      { defer: true }
    )
  );
  function createExtension(extension) {
    const compartment = new Compartment();
    function reconfigure(extension2) {
      const view = getView();
      if (!view) return;
      view.dispatch({
        effects: compartment.reconfigure(extension2),
      });
    }
    return { compartment, reconfigure, extension };
  }
  return {
    createExtension,
    getState,
    setState,
    getValue,
    setValue,
    getView,
    setView,
  };
}

function Button(props) {
  return ssrElement(
    "button",
    () => ({
      type: "button",
      ...props,
    }),
    undefined,
    true
  );
}

__astro_tag_component__(Button, "@astrojs/solid-js");

const _tmpl$$5 =
  '<path fill="currentColor" d="m4.21 4.387l.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12L4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094l-.083.094Z"></path>';
const _arrow_function$2 = (props = {}) =>
  ssrElement(
    "svg",
    () => ({
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...props,
    }),
    () => ssr(_tmpl$$5),
    true
  );

__astro_tag_component__(_arrow_function$2, "@astrojs/solid-js");

const _tmpl$$4 =
  '<g fill="none"><g filter="url(#svgIDa)"><path fill="url(#svgIDb)" d="M29.305 19.4a1.14 1.14 0 1 1 0-2.28h.22c.26 0 .48-.21.48-.48v-1.27a.48.48 0 0 0-.48-.48h-.18c-.63 0-1.17-.49-1.18-1.12c-.01-.64.5-1.16 1.14-1.16h.22c.26 0 .48-.21.48-.48v-1.56c0-.24-.18-.44-.42-.47a3.267 3.267 0 0 1-2.79-2.73a.57.57 0 0 0-.56-.48H5.745c-.28 0-.52.2-.56.48a3.268 3.268 0 0 1-2.77 2.72c-.24.03-.42.23-.42.47v1.57c0 .26.21.48.48.48h.18c.63 0 1.17.49 1.18 1.12c.01.64-.5 1.16-1.14 1.16h-.22a.48.48 0 0 0-.48.48v1.27c0 .26.21.48.48.48h.22a1.14 1.14 0 1 1 0 2.28h-.22a.48.48 0 0 0-.48.48v1.58c0 .24.18.44.42.47c1.42.19 2.55 1.3 2.77 2.71c.04.27.28.47.56.47h20.51c.28 0 .52-.2.56-.47a3.246 3.246 0 0 1 2.76-2.71c.24-.03.42-.23.42-.47v-1.58a.48.48 0 0 0-.48-.48h-.21Z"></path></g><path fill="url(#svgIDc)" fill-rule="evenodd" d="M6.26 11.98a2.284 2.284 0 0 1 2.285-2.285h14.91a2.285 2.285 0 0 1 2.285 2.285V20a2.284 2.284 0 0 1-2.285 2.285H20.45a.284.284 0 0 1-.21 0h-8.48a.284.284 0 0 1-.21 0H8.545A2.284 2.284 0 0 1 6.26 20v-8.02Zm14.37 9.735h2.825c.952 0 1.715-.771 1.715-1.715v-8.02c0-.944-.763-1.715-1.715-1.715H20.63v11.45Zm-.57-11.45v11.45h-8.12v-11.45h8.12Zm-11.515 0h2.825v11.45H8.545A1.714 1.714 0 0 1 6.83 20v-8.02c0-.944.763-1.715 1.715-1.715Z" clip-rule="evenodd"></path><path fill="#C43B66" d="M9.085 12.17c-.51 0-.93.42-.93.93v5.64c0 .51.42.93.93.93s.93-.42.93-.93V13.1c0-.52-.42-.93-.93-.93Z"></path><path fill="#C53C66" d="M23.025 12.17c-.51 0-.93.42-.93.93v5.64c0 .51.42.93.93.93s.93-.42.93-.93V13.1c0-.52-.42-.93-.93-.93Z"></path><path fill="#C43B66" d="M15.995 18.29a1.93 1.93 0 1 0 0-3.86a1.93 1.93 0 0 0 0 3.86Z"></path><defs><linearGradient id="svgIDb" x1="1.995" x2="30.005" y1="17.375" y2="17.375" gradientUnits="userSpaceOnUse"><stop stop-color="#ED3558"></stop><stop offset="1" stop-color="#FF51A8"></stop></linearGradient><linearGradient id="svgIDc" x1="8.62" x2="24.307" y1="15.313" y2="15.313" gradientUnits="userSpaceOnUse"><stop stop-color="#C43B66"></stop><stop offset="1" stop-color="#C63C66"></stop></linearGradient><filter id="svgIDa" width="29.01" height="18.72" x="1.495" y="6.39" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx="-.5"></feOffset><feGaussianBlur stdDeviation=".25"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 1 0 0 0 0 0.55 0 0 0 0 0.769156 0 0 0 1 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow_18_1325"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx=".5"></feOffset><feGaussianBlur stdDeviation=".25"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.909804 0 0 0 0 0.403922 0 0 0 0 0.427451 0 0 0 1 0"></feColorMatrix><feBlend in2="effect1_innerShadow_18_1325" result="effect2_innerShadow_18_1325"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dy="-.5"></feOffset><feGaussianBlur stdDeviation=".5"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.811765 0 0 0 0 0.164706 0 0 0 0 0.439216 0 0 0 1 0"></feColorMatrix><feBlend in2="effect2_innerShadow_18_1325" result="effect3_innerShadow_18_1325"></feBlend></filter></defs></g>';
const _arrow_function$1 = (props = {}) =>
  ssrElement(
    "svg",
    () => ({
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...props,
    }),
    () => ssr(_tmpl$$4),
    true
  );

__astro_tag_component__(_arrow_function$1, "@astrojs/solid-js");

const _tmpl$$3 = [
  "<div",
  "><!--#-->",
  '<!--/--><section class="flex-grow">',
  "</section><!--#-->",
  "<!--/--></div>",
];
function Tab(props) {
  const [tabs, { setActive, removeTab }] = props.tabsListState;
  return createComponent$1(Button, {
    get ["class"]() {
      return clsx("tab", {
        active: tabs.active == props.index,
      });
    },
    onClick: () => {
      setActive(props.index);
    },
    get children() {
      return ssr(
        _tmpl$$3,
        ssrHydrationKey(),
        escape$1(createComponent$1(_arrow_function$1, {})),
        escape$1(props.name),
        escape$1(
          createComponent$1(Button, {
            class: "close-tab-btn",
            title: "Close",
            onClick: () => {
              removeTab(props.index);
            },
            get children() {
              return createComponent$1(_arrow_function$2, {});
            },
          })
        )
      );
    },
  });
}

__astro_tag_component__(Tab, "@astrojs/solid-js");

function createModel(value, lang, url) {
  const state = null;
  return {
    url: url.toString(),
    value,
    state,
    transactions: [],
    lang,
  };
}

const _tmpl$$2 =
  '<path fill="currentColor" d="M11.75 3a.75.75 0 0 1 .743.648l.007.102l.001 7.25h7.253a.75.75 0 0 1 .102 1.493l-.102.007h-7.253l.002 7.25a.75.75 0 0 1-1.493.101l-.007-.102l-.002-7.249H3.752a.75.75 0 0 1-.102-1.493L3.752 11h7.25L11 3.75a.75.75 0 0 1 .75-.75Z"></path>';
const _arrow_function = (props = {}) =>
  ssrElement(
    "svg",
    () => ({
      viewBox: "0 0 24 24",
      width: "1.2em",
      height: "1.2em",
      ...props,
    }),
    () => ssr(_tmpl$$2),
    true
  );

__astro_tag_component__(_arrow_function, "@astrojs/solid-js");

const _tmpl$$1 = [
  "<div",
  ' class="tab-bar"><div class="tab-list">',
  "</div><!--#-->",
  "<!--/--></div>",
];
function TabList(props) {
  const [tabs, { addTab, setActive }] = props.tabsListState;
  return ssr(
    _tmpl$$1,
    ssrHydrationKey(),
    escape$1(
      createComponent$1(For, {
        get each() {
          return tabs.list;
        },
        children: (value, index) =>
          createComponent$1(Tab, {
            get name() {
              return value.url.toString();
            },
            get index() {
              return index();
            },
            get tabsListState() {
              return props?.tabsListState;
            },
          }),
      })
    ),
    escape$1(
      createComponent$1(Button, {
        class: "add-tab-btn",
        onClick: () => {
          const model = createModel(
            `const x = \`./test${tabs.list.length + 1}.ts\`;
console.log(x)`,
            javascript({
              jsx: true,
              typescript: true,
            }),
            `./test${tabs.list.length + 1}.ts`
          );
          addTab(model);
          setActive(tabs.list.length - 1);
        },
        get children() {
          return createComponent$1(_arrow_function, {});
        },
      })
    )
  );
}

__astro_tag_component__(TabList, "@astrojs/solid-js");

function isWrappable(obj) {
  return (
    obj != null &&
    typeof obj === "object" &&
    (Object.getPrototypeOf(obj) === Object.prototype || Array.isArray(obj))
  );
}
function setProperty(state, property, value, force) {
  if (!force && state[property] === value) return;
  if (value === undefined) {
    delete state[property];
  } else state[property] = value;
}
function mergeStoreNode(state, value, force) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key], force);
  }
}
function updateArray(current, next) {
  if (typeof next === "function") next = next(current);
  if (Array.isArray(next)) {
    if (current === next) return;
    let i = 0,
      len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value) setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part,
    next = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part,
      isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i))
          updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const { from = 0, to = current.length - 1, by = 1 } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    next = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(next, traversed);
    if (value === next) return;
  }
  if (part === undefined && value == undefined) return;
  if (
    part === undefined ||
    (isWrappable(next) && isWrappable(value) && !Array.isArray(value))
  ) {
    mergeStoreNode(next, value);
  } else setProperty(current, part, value);
}
function createStore(state) {
  const isArray = Array.isArray(state);
  function setStore(...args) {
    isArray && args.length === 1
      ? updateArray(state, args[0])
      : updatePath(state, args);
  }
  return [state, setStore];
}

function createTabList(props = {}) {
  const initialValue = props.initialValue ?? `console.log("Initial State")`;
  const defaultState = {
    initialValue,
    list: [
      createModel(
        initialValue,
        javascript({
          jsx: true,
          typescript: true,
        }),
        "./test.ts"
      ),
    ],
    active: 0,
  };
  const [state, setState] = createStore({
    list: props.list ?? defaultState.list,
    active: props.active ?? defaultState.active,
    initialValue,
  });
  const addTab = (model) => setState("list", [...state.list, model]);
  const removeTab = (index) => {
    return setState("list", [
      ...state.list.slice(0, index),
      ...state.list.slice(index + 1),
    ]);
  };
  const setActive = (index) => setState("active", index);
  return [state, { addTab, removeTab, setActive, setState }];
}

const _tmpl$ = [
  "<div",
  ' class="flex flex-col w-full h-full"><!--#-->',
  "<!--/-->",
  "</div>",
];
function Editor(props) {
  const [codemirrorProps, others] = splitProps(props, [
    "value",
    "onValueChange",
    "onEditorMount",
  ]);
  const tabsListState = createTabList({
    initialValue: props.value,
  });
  const [tabs, { setState: setTabState }] = tabsListState;
  const { createExtension, getState, getView } =
    createCodeMirror(codemirrorProps);
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
  return ssr(
    _tmpl$,
    ssrHydrationKey(),
    escape$1(
      createComponent$1(TabList, {
        get state() {
          return getState();
        },
        tabsListState: tabsListState,
      })
    ),
    ssrElement(
      "div",
      () => ({
        class: "w-full h-full overflow-auto",
        style: {
          "background-color": config.background,
        },
        ...others,
      }),
      undefined,
      false
    )
  );
}

__astro_tag_component__(Editor, "@astrojs/solid-js");

const $$Astro$1 = createAstro(
  "/workspaces/skf-examination-platform/src/pages/labs/[id]/lab.astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$Lab = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Lab;
  const labs = await getAllLabs();
  const { id } = Astro2.params;
  const lab = labs.find((lab2) => lab2.id == id);
  const isLoggedin = await checkSession(Astro2);
  if (!lab) {
    return new Response(null, {
      status: 404,
    });
  }
  const { name } = lab;
  const quizzes = [
    {
      title: "Quiz 1",
      description: "Quiz 1 description",
    },
    {
      title: "Quiz 2",
      description: "Quiz 2 description",
    },
    {
      title: "Quiz 3",
      description: "Quiz 3 description",
    },
  ];
  let { md } = lab;
  if (!md) {
    md =
      "https://raw.githubusercontent.com/blabla1337/skf-labs/master/md/Python/kbid-173-LFI-1.md";
  }
  let content = `Local File Inclusion (also known as LFI) is the process of including
          files, that are already locally present on the server, through the
          exploiting of vulnerable inclusion procedures implemented in the
          application. This vulnerability occurs, for example, when a page
          receives, as input, the path to the file that has to be included and
          this input is not properly sanitized, allowing directory traversal
          characters (such as dot-dot-slash) to be injected. Although most
          examples point to vulnerable PHP scripts, we should keep in mind that
          it is also common in other technologies such as JSP, ASP and others.`;
  function formatText(text) {
    text = text.replace(/{%.*?%}/g, "");
    text = text.replace(/\(.*?\.gitbook\/assets\/(.*?)\)/g, (match, p1) => {
      return `(https://raw.githubusercontent.com/blabla1337/skf-labs/master/.gitbook/assets/${p1})`;
    });
    text = text.replace(/(png|jpg)>\)/g, (match, p1) => {
      return `${p1})`;
    });
    text = text.replace(/!\[(.*?)\]\((.*?)\)/g, (match, p1, p2) => {
      return `![${p1}](${encodeURI(p2)})`;
    });
    return text;
  }
  function replaceTitle(text) {
    return text.replace(/<h1.*>(.*?)<\/h1>/g, `<h1>${name}</h1>`);
  }
  if (md) {
    const response = await fetch(md);
    let text = await response.text();
    text = formatText(text);
    content = marked.parse(text);
    content = replaceTitle(content);
  }
  return renderTemplate`${renderComponent(
    $$result,
    "BaseLayout",
    $$BaseLayout,
    {
      title: `SKF | LAB - ${name}`,
      loadNav: false,
      isLoggedin: isLoggedin,
      class: "astro-Q6WFC6GU",
    },
    {
      default: () => renderTemplate`${maybeRenderHead(
        $$result
      )}<div class="content astro-Q6WFC6GU">
    ${renderComponent($$result, "Nav", $$NavWrapper, {
      isLoggedin: isLoggedin,
      class: "astro-Q6WFC6GU",
    })}
    <main class="astro-Q6WFC6GU">
      <div class="write-up astro-Q6WFC6GU">
        <article class="astro-Q6WFC6GU">${unescapeHTML(content)}</article>
        ${renderComponent($$result, "Quizzes", Quizzes, {
          quizzes: quizzes,
          "client:load": true,
          "client:component-hydration": "load",
          "client:component-path":
            "/workspaces/skf-examination-platform/src/components/lab-sandbox/Quizzes.svelte",
          "client:component-export": "default",
          class: "astro-Q6WFC6GU",
        })}
      </div>
      ${renderComponent($$result, "Editor", Editor, {
        value: `const x = "Hello There";
console.log(x)`,
        "client:load": true,
        "client:component-hydration": "load",
        "client:component-path":
          "/workspaces/skf-examination-platform/src/components/editor/Editor",
        "client:component-export": "Editor",
        class: "astro-Q6WFC6GU",
      })}
      <!-- src="https://www.securityknowledgeframework.org/" -->
      <iframe${addAttribute(
        `/lab-sandbox-sample/?lab=${name}`,
        "src"
      )} width="100%" height="100%" allowfullscreen="" aria-hidden="false" tabindex="0" class="astro-Q6WFC6GU"></iframe>
    </main>
    <footer class="astro-Q6WFC6GU">
      ${renderComponent($$result, "Progress", Progress, {
        "client:load": true,
        "client:component-hydration": "load",
        "client:component-path":
          "/workspaces/skf-examination-platform/src/components/lab-sandbox/Progress.svelte",
        "client:component-export": "default",
        class: "astro-Q6WFC6GU",
      })}
      <a${addAttribute(
        `/labs/${id && +id + 1}/lab/`,
        "href"
      )} class="next-lab astro-Q6WFC6GU">Next Lab</a>
    </footer>
  </div>`,
    }
  )}

`;
});

const $$file$1 =
  "/workspaces/skf-examination-platform/src/pages/labs/[id]/lab.astro";
const $$url$1 = "/labs/[id]/lab";

const _page8 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$Lab,
      file: $$file$1,
      url: $$url$1,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const $$Astro = createAstro(
  "/workspaces/skf-examination-platform/src/pages/labs/[id].astro",
  "",
  "file:///workspaces/skf-examination-platform/"
);
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  return Astro2.redirect(Astro2.url.href + "/lab");
});

const $$file = "/workspaces/skf-examination-platform/src/pages/labs/[id].astro";
const $$url = "/labs/[id]";

const _page9 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$id,
      file: $$file,
      url: $$url,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const post$2 = async (context) => {
  const { request } = context;
  const { access_token, refresh_token } = await request.json();
  if (!access_token || !refresh_token) {
    return {
      body: JSON.stringify({
        error: true,
        message: "Missing access_token or refresh_token",
      }),
    };
  }
  let res;
  const { data, error } = await (
    await supabaseSSR(context)
  ).auth.setSession({
    access_token,
    refresh_token,
  });
  if (!error) res = { data, error: false };
  else {
    res = { data, error: true, message: error.message };
    console.error(error);
  }
  return {
    body: JSON.stringify({
      res,
    }),
  };
};

const _page10 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      post: post$2,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const post$1 = async (context) => {
  let res;
  const { error } = await (await supabaseSSR(context)).auth.signOut();
  if (error) {
    console.error(error);
    res = { error: true, message: error.message };
  }
  res = { error: false };
  return {
    body: JSON.stringify({
      res,
    }),
  };
};

const _page11 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      post: post$1,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const post = async (context) => {
  const { request } = context;
  const { email, password } = await request.json();
  let res;
  const { data, error } = await (
    await supabaseSSR(context)
  ).auth.signInWithPassword({
    email,
    password,
  });
  if (!error) res = { data, error: false };
  else res = res = { data, error: true, message: error.message };
  return {
    body: JSON.stringify({
      res,
    }),
  };
};

const _page12 = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      post,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const pageMap = new Map([
  ["src/pages/index.astro", _page0],
  ["src/pages/lab-sandbox-sample.astro", _page1],
  ["src/pages/dashboard.astro", _page2],
  ["src/pages/register.astro", _page3],
  ["src/pages/profile.astro", _page4],
  ["src/pages/module/[id].astro", _page5],
  ["src/pages/login.astro", _page6],
  ["src/pages/labs/index.astro", _page7],
  ["src/pages/labs/[id]/lab.astro", _page8],
  ["src/pages/labs/[id].astro", _page9],
  ["src/pages/api/login-jwt.ts", _page10],
  ["src/pages/api/logout.ts", _page11],
  ["src/pages/api/login.ts", _page12],
]);
const renderers = [
  Object.assign(
    {
      name: "astro:jsx",
      serverEntrypoint: "astro/jsx/server.js",
      jsxImportSource: "astro",
    },
    { ssr: server_default }
  ),
  Object.assign(
    {
      name: "@astrojs/svelte",
      clientEntrypoint: "@astrojs/svelte/client.js",
      serverEntrypoint: "@astrojs/svelte/server.js",
    },
    { ssr: _renderer1 }
  ),
  Object.assign(
    {
      name: "@astrojs/solid-js",
      clientEntrypoint: "@astrojs/solid-js/client.js",
      serverEntrypoint: "@astrojs/solid-js/server.js",
      jsxImportSource: "solid-js",
    },
    { ssr: server_default$1 }
  ),
];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose"));
  else if (process.argv.includes("--silent"));
  else;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS)
    .map((s) => s.slice(1))
    .join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less",
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS)
    .map((s) => s.slice(1))
    .join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments
    .map((segment) => {
      return (
        "/" +
        segment
          .map((part) => {
            if (part.spread) {
              return `:${part.content.slice(3)}(.*)?`;
            } else if (part.dynamic) {
              return `:${part.content}`;
            } else {
              return part.content
                .normalize()
                .replace(/\?/g, "%3F")
                .replace(/#/g, "%23")
                .replace(/%5B/g, "[")
                .replace(/%5D/g, "]")
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            }
          })
          .join("")
      );
    })
    .join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(
      rawRouteData.segments,
      rawRouteData._meta.trailingSlash
    ),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData),
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes,
  };
}

const _manifest = Object.assign(
  deserializeManifest({
    adapterName: "@astrojs/netlify/functions",
    routes: [
      {
        file: "",
        links: ["assets/index.5dff2701.css", "assets/dashboard.6c0072f8.css"],
        scripts: [],
        routeData: {
          route: "/",
          type: "page",
          pattern: "^\\/$",
          segments: [],
          params: [],
          component: "src/pages/index.astro",
          pathname: "/",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: [
          "assets/dashboard.6c0072f8.css",
          "assets/lab-sandbox-sample.3e4875c2.css",
        ],
        scripts: [],
        routeData: {
          route: "/lab-sandbox-sample",
          type: "page",
          pattern: "^\\/lab-sandbox-sample\\/?$",
          segments: [
            [{ content: "lab-sandbox-sample", dynamic: false, spread: false }],
          ],
          params: [],
          component: "src/pages/lab-sandbox-sample.astro",
          pathname: "/lab-sandbox-sample",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: [
          "assets/dashboard.6c0072f8.css",
          "assets/dashboard.ee39c248.css",
        ],
        scripts: [],
        routeData: {
          route: "/dashboard",
          type: "page",
          pattern: "^\\/dashboard\\/?$",
          segments: [[{ content: "dashboard", dynamic: false, spread: false }]],
          params: [],
          component: "src/pages/dashboard.astro",
          pathname: "/dashboard",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: [
          "assets/register.47391b41.css",
          "assets/register.ccd1a893.css",
          "assets/dashboard.6c0072f8.css",
        ],
        scripts: [],
        routeData: {
          route: "/register",
          type: "page",
          pattern: "^\\/register\\/?$",
          segments: [[{ content: "register", dynamic: false, spread: false }]],
          params: [],
          component: "src/pages/register.astro",
          pathname: "/register",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: ["assets/dashboard.6c0072f8.css", "assets/profile.55226b48.css"],
        scripts: [],
        routeData: {
          route: "/profile",
          type: "page",
          pattern: "^\\/profile\\/?$",
          segments: [[{ content: "profile", dynamic: false, spread: false }]],
          params: [],
          component: "src/pages/profile.astro",
          pathname: "/profile",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: ["assets/dashboard.6c0072f8.css", "assets/_id_.b8a7cc0d.css"],
        scripts: [],
        routeData: {
          route: "/module/[id]",
          type: "page",
          pattern: "^\\/module\\/([^/]+?)\\/?$",
          segments: [
            [{ content: "module", dynamic: false, spread: false }],
            [{ content: "id", dynamic: true, spread: false }],
          ],
          params: ["id"],
          component: "src/pages/module/[id].astro",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: [
          "assets/dashboard.6c0072f8.css",
          "assets/register.47391b41.css",
          "assets/login.9fb455aa.css",
        ],
        scripts: [],
        routeData: {
          route: "/login",
          type: "page",
          pattern: "^\\/login\\/?$",
          segments: [[{ content: "login", dynamic: false, spread: false }]],
          params: [],
          component: "src/pages/login.astro",
          pathname: "/login",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: ["assets/dashboard.6c0072f8.css", "assets/index.2524f1dc.css"],
        scripts: [],
        routeData: {
          route: "/labs",
          type: "page",
          pattern: "^\\/labs\\/?$",
          segments: [[{ content: "labs", dynamic: false, spread: false }]],
          params: [],
          component: "src/pages/labs/index.astro",
          pathname: "/labs",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: ["assets/lab.ec2f9a17.css", "assets/dashboard.6c0072f8.css"],
        scripts: [],
        routeData: {
          route: "/labs/[id]/lab",
          type: "page",
          pattern: "^\\/labs\\/([^/]+?)\\/lab\\/?$",
          segments: [
            [{ content: "labs", dynamic: false, spread: false }],
            [{ content: "id", dynamic: true, spread: false }],
            [{ content: "lab", dynamic: false, spread: false }],
          ],
          params: ["id"],
          component: "src/pages/labs/[id]/lab.astro",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: [],
        scripts: [],
        routeData: {
          route: "/labs/[id]",
          type: "page",
          pattern: "^\\/labs\\/([^/]+?)\\/?$",
          segments: [
            [{ content: "labs", dynamic: false, spread: false }],
            [{ content: "id", dynamic: true, spread: false }],
          ],
          params: ["id"],
          component: "src/pages/labs/[id].astro",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: [],
        scripts: [],
        routeData: {
          route: "/api/login-jwt",
          type: "endpoint",
          pattern: "^\\/api\\/login-jwt$",
          segments: [
            [{ content: "api", dynamic: false, spread: false }],
            [{ content: "login-jwt", dynamic: false, spread: false }],
          ],
          params: [],
          component: "src/pages/api/login-jwt.ts",
          pathname: "/api/login-jwt",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: [],
        scripts: [],
        routeData: {
          route: "/api/logout",
          type: "endpoint",
          pattern: "^\\/api\\/logout$",
          segments: [
            [{ content: "api", dynamic: false, spread: false }],
            [{ content: "logout", dynamic: false, spread: false }],
          ],
          params: [],
          component: "src/pages/api/logout.ts",
          pathname: "/api/logout",
          _meta: { trailingSlash: "ignore" },
        },
      },
      {
        file: "",
        links: [],
        scripts: [],
        routeData: {
          route: "/api/login",
          type: "endpoint",
          pattern: "^\\/api\\/login$",
          segments: [
            [{ content: "api", dynamic: false, spread: false }],
            [{ content: "login", dynamic: false, spread: false }],
          ],
          params: [],
          component: "src/pages/api/login.ts",
          pathname: "/api/login",
          _meta: { trailingSlash: "ignore" },
        },
      },
    ],
    base: "/",
    markdown: {
      drafts: false,
      syntaxHighlight: "shiki",
      shikiConfig: { langs: [], theme: "github-dark", wrap: false },
      remarkPlugins: [],
      rehypePlugins: [],
      remarkRehype: {},
      extendDefaultPlugins: false,
      isAstroFlavoredMd: false,
    },
    pageMap: null,
    renderers: [],
    entryModules: {
      "\u0000@astrojs-ssr-virtual-entry": "entry.mjs",
      "/workspaces/skf-examination-platform/src/components/dashboard/Matrix.svelte":
        "Matrix.b7f5f083.js",
      "/workspaces/skf-examination-platform/src/components/profile/Profile.svelte":
        "Profile.4536d26e.js",
      "/workspaces/skf-examination-platform/src/components/RegisterAndLogin.svelte":
        "RegisterAndLogin.1d0d704e.js",
      "/workspaces/skf-examination-platform/src/components/lab-sandbox/Quizzes.svelte":
        "Quizzes.5888f29b.js",
      "/workspaces/skf-examination-platform/src/components/editor/Editor":
        "Editor.3f26e0cd.js",
      "/workspaces/skf-examination-platform/src/components/lab-sandbox/Progress.svelte":
        "Progress.01ec8e86.js",
      "/workspaces/skf-examination-platform/src/components/Auth.svelte":
        "Auth.3d2a2323.js",
      "/workspaces/skf-examination-platform/src/components/Nav.svelte":
        "Nav.5361106b.js",
      "@astrojs/svelte/client.js": "client.e4ae9431.js",
      "@astrojs/solid-js/client.js": "client.285976b9.js",
      "astro:scripts/before-hydration.js": "",
    },
    assets: [
      "/assets/manrope-cyrillic-400-normal.7ad0fb12.woff2",
      "/assets/manrope-greek-400-normal.fd57e2ca.woff2",
      "/assets/manrope-latin-ext-400-normal.ae771e01.woff2",
      "/assets/manrope-latin-400-normal.30694bbe.woff2",
      "/assets/lexend-deca-latin-ext-400-normal.0df676db.woff2",
      "/assets/electrolize-latin-400-normal.57372a17.woff2",
      "/assets/open-sans-cyrillic-ext-400-normal.bbbef4da.woff2",
      "/assets/lexend-deca-latin-400-normal.4c5d8900.woff2",
      "/assets/open-sans-greek-400-normal.7bd5dafc.woff2",
      "/assets/open-sans-hebrew-400-normal.100ac33d.woff2",
      "/assets/open-sans-latin-ext-400-normal.140ef34d.woff2",
      "/assets/open-sans-latin-400-normal.b34551ae.woff2",
      "/assets/open-sans-vietnamese-400-normal.62829378.woff2",
      "/assets/open-sans-cyrillic-ext-800-normal.3c69ac18.woff2",
      "/assets/open-sans-cyrillic-800-normal.78bc40b2.woff2",
      "/assets/open-sans-greek-800-normal.c2fdde5c.woff2",
      "/assets/open-sans-vietnamese-800-normal.282c5b96.woff2",
      "/assets/open-sans-hebrew-800-normal.b57951ac.woff2",
      "/assets/open-sans-latin-ext-800-normal.0ba3937b.woff2",
      "/assets/open-sans-latin-800-normal.e7cba74a.woff2",
      "/assets/open-sans-cyrillic-ext-700-normal.160dc29a.woff2",
      "/assets/open-sans-cyrillic-700-normal.c2c33e32.woff2",
      "/assets/open-sans-greek-700-normal.2662a8cf.woff2",
      "/assets/open-sans-vietnamese-700-normal.2e524292.woff2",
      "/assets/open-sans-hebrew-700-normal.d347ddda.woff2",
      "/assets/open-sans-latin-ext-700-normal.f7595b91.woff2",
      "/assets/open-sans-latin-700-normal.d1a17abb.woff2",
      "/assets/open-sans-cyrillic-ext-600-normal.75c2ffe3.woff2",
      "/assets/open-sans-cyrillic-400-normal.624b7132.woff2",
      "/assets/open-sans-cyrillic-600-normal.58888d26.woff2",
      "/assets/open-sans-greek-600-normal.2bd431b8.woff2",
      "/assets/open-sans-latin-ext-600-normal.05dbb1e9.woff2",
      "/assets/open-sans-latin-600-normal.4ffc35ac.woff2",
      "/assets/open-sans-vietnamese-600-normal.8f098b1a.woff2",
      "/assets/open-sans-hebrew-600-normal.b94928fd.woff2",
      "/assets/manrope-all-400-normal.1920a0f3.woff",
      "/assets/lexend-deca-all-400-normal.19ed803c.woff",
      "/assets/electrolize-all-400-normal.9b99b3cf.woff",
      "/assets/open-sans-all-400-normal.17d899f5.woff",
      "/assets/open-sans-all-800-normal.aa3bec7c.woff",
      "/assets/open-sans-all-700-normal.87eac349.woff",
      "/assets/open-sans-all-600-normal.ad9899b9.woff",
      "/assets/_id_.b8a7cc0d.css",
      "/assets/dashboard.6c0072f8.css",
      "/assets/dashboard.ee39c248.css",
      "/assets/index.2524f1dc.css",
      "/assets/index.5dff2701.css",
      "/assets/lab-sandbox-sample.3e4875c2.css",
      "/assets/lab.ec2f9a17.css",
      "/assets/login.9fb455aa.css",
      "/assets/profile.55226b48.css",
      "/assets/register.ccd1a893.css",
      "/assets/register.47391b41.css",
      "/Auth.3d2a2323.js",
      "/Editor.3f26e0cd.js",
      "/Matrix.b7f5f083.js",
      "/Nav.5361106b.js",
      "/Profile.4536d26e.js",
      "/Progress.01ec8e86.js",
      "/Quizzes.5888f29b.js",
      "/RegisterAndLogin.1d0d704e.js",
      "/client.285976b9.js",
      "/client.e4ae9431.js",
      "/favicon.svg",
      "/chunks/client.025d74aa.js",
      "/chunks/index.90986ff4.js",
      "/chunks/index.ea3442f1.js",
      "/chunks/labStore.1187ad8a.js",
      "/chunks/main.00abf126.js",
      "/chunks/setUserSSRSession.3e8ea6b1.js",
      "/chunks/user.f07657fe.js",
      "/chunks/web.77a18fb9.js",
      "/imgs/background-logo.svg",
      "/imgs/skf-certificate.jpg",
    ],
  }),
  {
    pageMap: pageMap,
    renderers: renderers,
  }
);
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports["handler"];

const _start = "start";
if (_start in adapter) {
  adapter[_start](_manifest, _args);
}

export { handler };
