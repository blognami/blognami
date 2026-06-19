
import { Component } from './component.js';

import { Workspace } from './workspace.js';

if (typeof navigator != 'undefined' && "serviceWorker" in navigator) {
    (async () => {
        try {
            // Escape hatch: when the page carries our reserved ?_disableServiceWorker
            // flag, skip registration entirely. The worker unregisters itself when it
            // sees the flag, so re-registering here would just recreate it on the same
            // load and defeat the bypass.
            if(new URL(location.href).searchParams.has('_disableServiceWorker')) return;

            let scriptUrl = Component.instanceFor(document).head.find('meta[name="pinstripe-service-worker-url"]')?.params.content;
            if(!scriptUrl) return;

            const registration = await navigator.serviceWorker.getRegistration(scriptUrl);

            // We deliberately unregister + re-register on every full load rather than
            // reusing the existing registration via registration.update(). In Pinstripe
            // full reloads are rare (navigation patches the DOM), so this runs seldom and
            // is cheap — and it doubles as a recovery affordance: a hard refresh always
            // yields a pristine worker, clearing any wedged runtime state. update() would
            // only swap on a code change, so a runtime-wedged worker would survive a reload.
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
    Workspace.run(function() { return this.serviceWorker.start(); });
}