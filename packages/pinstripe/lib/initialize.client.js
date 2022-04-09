
import { NodeWrapper } from './node_wrapper.js';

if(typeof window != 'undefined'){
    let ready = false;

    setTimeout(() => {
        ready = true;

        const documentNodeWrapper = NodeWrapper.instanceFor(document);

        documentNodeWrapper.observe({ add: true }, nodeWrapper => nodeWrapper.descendants);

        documentNodeWrapper.patch(document.documentElement.outerHTML);
    }, 0);
}

