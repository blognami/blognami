
import { View } from "../view.js";

export default {
  meta(){
        this.addToClient();
  },
  
  create() {
    return (name, params = {}) => this.defer(async () => {
      const mappedName = await this.viewMap[name];
      if (!mappedName) return;
      return View.render(this.context, mappedName, params);
    });
  },
};
