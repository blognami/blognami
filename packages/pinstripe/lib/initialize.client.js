
import { NodeWrapper } from './node_wrapper.js';

if(typeof window != 'undefined'){
    let ready = false;

    function initializeTree(node){
        NodeWrapper.instanceFor(node).descendants
    }

    const observer = new MutationObserver(mutations => {
        if(ready){
            mutations.forEach(
                mutation => {
                    mutation.addedNodes.forEach(node => initializeTree(node));
                }
            )
        }
    })

    observer.observe(document.documentElement, {
        attributes: false,
        childList: true,
        subtree: true
    });

    setTimeout(() => {
        ready = true
        NodeWrapper.instanceFor(document).patch(
            document.documentElement.outerHTML
        );
    }, 0);
}

