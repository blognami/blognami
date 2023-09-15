
import { Component } from './component.js';

if(typeof window != 'undefined'){
    const [ styleEl ] = Component.new(document.head, true).prepend(`<style>body { display: none; }</style>`);
    window.addEventListener('DOMContentLoaded', () => {
        const documentComponent = Component.instanceFor(document);
        documentComponent.observe({ add: true }, component => component.descendants);
        documentComponent.patch(document.documentElement.outerHTML);
        styleEl.remove();
    });
}

