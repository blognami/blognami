
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
            console.log(registration);
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    })();
}

if(typeof window == 'undefined' && typeof addEventListener == 'function'){
    console.log('------- worker!');

    addEventListener("install", (event) => {
        console.log('------- install');
        event.waitUntil(skipWaiting());
    });

    addEventListener("fetch", (event) => {
        console.log('------- fetch', event.request.url);
        event.respondWith(fetch(event.request));
    });
}