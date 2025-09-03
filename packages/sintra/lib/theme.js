import { Class } from "./class.js";
import { Singleton } from "./singleton.js";

export const Theme = Class.extend().include({
  meta() {
    this.assignProps({ name: 'Theme' });

    this.include(Singleton);
  },

  colors: {
    accent: '#FF1A75',
    primaryText: '#000',
    secondaryText: '#757575',
    lighterGray: '#f6f6f6',
    lightGray: '#e6e6e6',
    midGray: '#ccc',
    darkGray: '#444',
    darkerGray: '#15171a'
  },

  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif',
    serif: 'Times, serif',
    mono: 'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace'
  },

  spacing: {},

  breakpoints: {},

  remify,
});

function remify(value) {
  return `${parseInt(value) / 16}rem`;
}
