import { Class } from "./class.js";
import { themeVariables } from './theme_variables.js';

export const Theme = Class.extend().include({
  meta() {
    this.assignProps({ name: 'Theme' });

    this.include(themeVariables);

    this.include({
      deepMerge(variables){
        deepMerge(this, variables);
        return this;
      },

      resolveReferences(){
        // will resolves any references in the theme object e.g. @colors.pink.600
      },

      remify,
    })

    this.prototype.deepMerge({
      colors: {
        sintra: {
          accent: 'oklch(59.2% 0.249 0.584)', // eventually we can use a @colors.pink.600 reference here
          primaryText: '#000',
          secondaryText: '#757575',
          lighterGray: '#f6f6f6',
          lightGray: '#e6e6e6',
          darkGray: '#444',
        }
      }
    });
  }
});

function remify(value) {
  return `${parseInt(value) / 16}rem`;
}

function deepMerge(target, source) {
  for(const [key, value] of Object.entries(source)){
    if(typeof value == 'object'){
      if(typeof target[key] != 'object'){
        target[key] = {};
      } else {
        target[key] = { ...target[key] };
      }
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
}
