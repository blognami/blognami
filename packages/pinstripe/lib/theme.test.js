import test from "node:test";
import assert from "node:assert";

import { Theme } from "./theme.js";

test(`Theme`, async () => {
  const theme = Theme.new();

  assert.equal(typeof theme.colors.red[500], "string");

  theme.deepMerge({ apple: "green" });

  assert.equal(theme.apple, "green");

  theme.deepMerge({
    colors: {
      semantic: {
        plum: "purple",
      },
    },
  });

  assert.equal(theme.colors.semantic.plum, "purple");
  assert.equal(typeof theme.colors.red[500], "string");

  const theme2 = Theme.new();

  assert.equal(theme2.apple, undefined);
  assert.equal(theme2.colors.semantic.plum, undefined);
});
