
const element = typeof document != 'undefined' ? document.createElement('div') : null;
const entityCache = {};

export function unescapeHtml(string){
  return string.replace(/&[^\s;]+;{0,1}/gi, function(entity){
    if(!entityCache[entity]){
      element.innerHTML = entity
      entityCache[entity] = element.childNodes.length == 0 ? "" : element.childNodes[0].nodeValue
    }
    return entityCache[entity]
  })
}
