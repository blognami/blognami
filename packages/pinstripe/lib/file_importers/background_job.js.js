

import { FileImporter } from "../file_importer.js";
import { BackgroundJob } from "../background_job.js";

FileImporter.register('background_job.js', {
    async importFile(){
        const {relativeFilePathWithoutExtension, filePath} = this;
        if(!filePath.match(/\/[^\.\/]+\.js$/)) return;
        if(relativeFilePathWithoutExtension == '_file_importer') return;
        const { default: _default } = (await import(filePath));
        if(!_default) return;
        BackgroundJob.register(relativeFilePathWithoutExtension, {
            meta(){
                this.filePaths.push(filePath);
                this.include(_default);
            }
        });
    }
});
