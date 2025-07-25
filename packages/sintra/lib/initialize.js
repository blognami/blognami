
import '@sintra/utils/node'; // sintra-if-client: /* ignore */
import { Component } from './component.js';

import { Workspace } from './workspace.js';

if (typeof navigator != 'undefined' && "serviceWorker" in navigator) {
    (async () => {
        try {
            let scriptUrl = Component.instanceFor(document).head.find('meta[name="sintra-service-worker-url"]')?.params.content;
            if(!scriptUrl) return;

            const registration = await navigator.serviceWorker.getRegistration(scriptUrl);

            if(registration) await registration.unregister();

            await navigator.serviceWorker.register(scriptUrl, {
                scope: "./",
                updateViaCache: "none"
            });
        } catch (error) {
            console.error(`Service worker registration failed with ${error}`);
        }
    })();
}

if(typeof window == 'undefined' && typeof addEventListener == 'function'){
    Workspace.run(({ serviceWorker }) => serviceWorker.start());
}