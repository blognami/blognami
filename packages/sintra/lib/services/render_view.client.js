
import { View } from "../view.js";

export default {
  create() {
    return async (name, params = {}) => {
      const mappedName = await this.viewMap[name];
      if (!mappedName) return;
      return View.render(this.context, mappedName, params);
    };
  },
};
