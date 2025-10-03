
import { deepMerge } from "@pinstripe/utils";

import { Class } from "./class.js";
import { themeDefaultDesignTokens } from "./theme_default_design_tokens.js";

export const Theme = Class.extend().include({
  meta() {
    this.assignProps({ name: "Theme" });

    this.assignProps({
      defineDesignTokens(designTokens) {
        const { initialize } = this.prototype;
        this.include({
          initialize() {
            if (initialize) initialize.call(this);
            this.deepMerge(designTokens);
          }
        });
      }
    });

    this.defineDesignTokens(themeDefaultDesignTokens);
  },

  deepMerge(variables) {
    deepMerge(this, variables);
    return this;
  },

  resolveReferences() {
    while (true) {
      let isChange = false;
      traverse(this, (value) => {
        if (typeof value != "string") return value;
        const matches = value.match(/@([\w.]+)/);
        if (!matches) return value;
        isChange = true;
        return getNestedProperty(this, matches[1]);
      });
      if (!isChange) break;
    }
    return this;
  },

  breakpointFor(minWidthProperty) {
    const minWidth = this.getNestedProperty(`breakpoints.${minWidthProperty}`);
    return `@media (min-width: ${minWidth})`;
  },

  getNestedProperty(path) {
    return getNestedProperty(this, path);
  },

  remify,
});

function remify(value) {
  return `${parseInt(value) / 16}rem`;
}

function traverse(o, fn) {
  for (const key in o) {
    if (typeof o[key] === "object") {
      traverse(o[key], fn);
    } else {
      o[key] = fn(o[key]);
    }
  }
}

function getNestedProperty(o, path) {
  return path.split(".").reduce((o, p) => (o ? o[p] : undefined), o);
}
