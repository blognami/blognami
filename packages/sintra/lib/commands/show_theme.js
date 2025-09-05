export default {
  async run() {
    const theme = await this.theme;

    theme.deepMerge(
      [
        "fonts",
        "colors",
        "spacing",
        "breakpoints",
        "containers",
        "text",
        "fontWeight",
        "tracking",
        "leading",
        "radius",
        "shadow",
        "insetShadow",
        "dropShadow",
        "textShadow",
        "blur",
        "perspective",
        "aspect",
        "easing",
        "animation",
      ].reduce((out, key) => {
        out[key] = {};
        return out;
      }, {})
    );

    console.log(JSON.stringify(theme, null, 2));
  },
};
