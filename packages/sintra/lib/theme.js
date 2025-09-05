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
        for(const key of Object.keys(themeVariables)){
          this[key] = this[key];
        }
        while(true){
          let isChange = false;
          traverse(this, value => {
            if(typeof value != 'string') return value;
            const matches = value.match(/@([\w.]+)/);
            if(!matches) return value;
            isChange = true;
            return getNestedProperty(this, matches[1]);
          });
          if(!isChange) break;
        }
        return this;
      },

      remify,
    })

    this.prototype.deepMerge({
      colors: {
        sintra: {
          accent: '@colors.pink.600',
          primaryText: '@colors.black',
          secondaryText: '@colors.gray.500',
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

function traverse(o, fn){
  for(const key in o){
    if(typeof o[key] === 'object'){
      traverse(o[key], fn);
    } else {
      o[key] = fn(o[key]);
    }
  }
}

function getNestedProperty(o, path) {
  return path.split('.').reduce((o, p) => o ? o[p] : undefined, o);
}