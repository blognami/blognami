import { fileURLToPath } from 'url'; // pinstripe-if-client: const fileURLToPath = undefined;

import { FileImporter } from "../file_importer.js";
import { Component } from "../component.js";
import { Bundle } from '../bundle.js'; // pinstripe-if-client: const Bundle = undefined;

FileImporter.register('component.js', {
    async importFile(){
        const {relativeFilePathWithoutExtension, filePath} = this;
        if(!filePath.match(/\/[^\.\/]+\.js$/)) return;
        if(relativeFilePathWithoutExtension == '_file_importer') return;
        const { default: _default } = (await import(filePath));
        if(!_default) return;
        Component.register(relativeFilePathWithoutExtension, {
            meta(){
                this.filePaths.push(filePath);
                this.include(_default);
            }
        });
        Bundle.addModule('window', `
            import { Component } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
            import include from ${JSON.stringify(filePath)};
            Component.register(${JSON.stringify(relativeFilePathWithoutExtension)}, include);
        `);
    }
});
