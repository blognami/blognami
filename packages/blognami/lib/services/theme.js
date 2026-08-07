import { Theme } from "../theme.js";

export default {
  create() {
    return this.defer(async () => {
      return this.context.root.getOrCreate('theme', async () => Theme.new().deepMerge(
        (await this.config.theme) || {}
      ));
    });
  },
};
