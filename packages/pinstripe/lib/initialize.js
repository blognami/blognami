
import { Component } from './component.js';
import { Workspace } from './workspace.js';

if(typeof window != 'undefined'){
    window.addEventListener('DOMContentLoaded', () => {
        const documentComponent = Component.instanceFor(document);
        documentComponent.observe({ add: true }, component => component.descendants);
        documentComponent.patch(document.documentElement.outerHTML);
    });
}

if(typeof window == 'undefined' && typeof addEventListener == 'function'){
    Workspace.run(({ worker }) => worker.start());
}