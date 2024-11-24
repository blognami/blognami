
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
            const scriptUrl = "/_shell/javascripts/all.js?bundle=worker";
            
            const registration = await navigator.serviceWorker.getRegistration(scriptUrl);

            if(registration) await registration.unregister();

            await navigator.serviceWorker.register(scriptUrl, {
                scope: "./",
            });          
        } catch (error) {
            console.error(`Service worker registration failed with ${error}`);
        }
    })();
}

if(typeof window == 'undefined' && typeof addEventListener == 'function'){
    Workspace.run(({ worker }) => worker.start());
}