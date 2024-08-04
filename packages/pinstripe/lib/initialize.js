
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

if (typeof navigator != 'undefined' && "serviceWorker" in navigator) {
    (async () => {
        try {
            const registration = await navigator.serviceWorker.register("/_shell/javascripts/all.js?bundle=worker", {
                scope: "./",
            });
            if (registration.installing) {
            console.log("Service worker installing");
            } else if (registration.waiting) {
            console.log("Service worker installed");
            } else if (registration.active) {
            console.log("Service worker active");
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    })();
}

if(typeof self != 'undefined' && typeof window == 'undefined'){
    console.log('------------- self', self);
}