
import './components/index.js';
import { Component } from './component.js';

if(typeof window != 'undefined'){
    const originalDisplay = document.documentElement.style.display;
    document.documentElement.style.display = 'none';
    window.addEventListener('DOMContentLoaded', () => {
        const documentComponent = Component.instanceFor(document);
        documentComponent.observe({ add: true }, component => component.descendants);
        documentComponent.patch(document.documentElement.outerHTML);

        const interval = setInterval(() => {
            documentComponent.progressBar.startCount == 0;
            clearInterval(interval);
            document.documentElement.style.display = originalDisplay;
        }, 100);
    });
}
