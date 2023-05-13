import { fileURLToPath } from 'url'; // pinstripe-if-client: const fileURLToPath = undefined;

import { Component } from '../component.js';
import { Client } from '../client.js'; // pinstripe-if-client: const Client = undefined;

Component.FileImporter.register('jsx', {
    importFile({ relativeFilePathWithoutExtension, filePath }){
        Component.register(relativeFilePathWithoutExtension);

        Client.instance.addModule(`
            import React from 'react';
            import { createRoot } from 'react-dom/client';
            import { Component } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
            import JsxComponent from ${JSON.stringify(filePath)};

            Component.register(${JSON.stringify(relativeFilePathWithoutExtension)}, {
                initialize(...args){
                    this.constructor.parent.prototype.initialize.call(this, ...args);
                    const rootEl = this.shadow.patch('<div></div>')[0].node;
                    const root = createRoot(rootEl);
                    root.render(React.createElement(JsxComponent, this.attributes, null));
                    this.on('clean', () => root.unmount());
                }
            });
        `);
    }
});

