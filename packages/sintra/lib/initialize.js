
import '@sintra/utils/node'; // sintra-if-client: /* ignore */

import { Component } from './component.js';
import { HttpProxy } from './http_proxy.js';
import { Workspace } from './workspace.js';

if(typeof window != 'undefined'){
    Component.register('pinstripe-document', {
        get httpProxy(){
            if(!this._httpProxy){
                this._httpProxy = HttpProxy.new();
            }
            return this._httpProxy;
        }
    });
}

if(typeof window == 'undefined' && typeof addEventListener == 'function'){
    Workspace.run(({ worker }) => worker.start());
}