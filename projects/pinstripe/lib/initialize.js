
import { NodeWrapper } from './node_wrapper.js';

if(typeof window != 'undefined'){
    window.addEventListener('DOMContentLoaded', () => {
        const documentNodeWrapper = NodeWrapper.instanceFor(document);
        documentNodeWrapper.observe({ add: true }, nodeWrapper => nodeWrapper.descendants);
        documentNodeWrapper.patch(document.documentElement.outerHTML);
    });
}

