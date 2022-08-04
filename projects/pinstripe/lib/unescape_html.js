
const element = document.createElement('div');
const entityCache = {};

export const unescapeHtml = string => {
  return string.replace(/&[^\s;]+;{0,1}/gi, entity => {
    if(!entityCache[entity]){
      if(element){
        element.innerHTML = entity;
        entityCache[entity] = element.childNodes.length == 0 ? "" : element.childNodes[0].nodeValue;
      } else {
        entityCache[entity] = decode(entity);
      }
    }
    return entityCache[entity];
  });
};
