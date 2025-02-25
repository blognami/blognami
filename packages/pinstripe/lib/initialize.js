
import './components/index.js';
import { Component } from './component.js';

if(typeof window != 'undefined'){
    window.addEventListener('DOMContentLoaded', () => {
        const documentComponent = Component.instanceFor(document);
        documentComponent.observe({ add: true }, component => component.descendants);
        documentComponent.patch(document.documentElement.outerHTML);
    });
}
