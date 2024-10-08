
import { Component } from './component.js';
import { Workspace } from './workspace.js';

if(typeof window != 'undefined'){
    window.addEventListener('DOMContentLoaded', () => {
        const documentComponent = Component.instanceFor(document);
        documentComponent.observe({ add: true }, component => component.descendants);
        documentComponent.patch(document.documentElement.outerHTML);
    });
}

if (typeof navigator != 'undefined' && "serviceWorker" in navigator) {
    (async () => {
        try {
            await navigator.serviceWorker.register("/_shell/javascripts/all.js?bundle=worker", {
                scope: "./",
            });
            console.log("Service worker registered");
        } catch (error) {
            console.error(`Service worker registration failed with ${error}`);
        }
    })();
}

if(typeof window == 'undefined' && typeof addEventListener == 'function'){
    Workspace.run(({ worker }) => worker.start());
}