import { Class } from "./class.js";
import { Singleton } from "./singleton.js";

export const Theme = Class.extend().include({
  meta() {
    this.include(Singleton);
    
  },

  colors: {},

  fonts: {},

  spacing: {},

  breakpoints: {},

  remify,
});

function remify(value) {
  return `${parseInt(value) / 16}rem`;
}
