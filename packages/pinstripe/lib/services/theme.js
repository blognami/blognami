import { Theme } from "../theme.js";

export default {
  create() {
    return this.defer(async () => {
      if (!this.context.root.theme) {
        this.context.root.theme = Theme.new().deepMerge(
          (await this.config.theme) || {}
        );
      }
      return this.context.root.theme;
    });
  },
};
