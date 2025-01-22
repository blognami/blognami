
import { FileImporter } from "../../../file_importer.js";
import { Row } from "../row.js";

FileImporter.register('model.js', {
    async importFile(){
        const {relativeFilePathWithoutExtension, filePath} = this;
        if(!filePath.match(/\/[^\.\/]+\.js$/)) return;
        if(relativeFilePathWithoutExtension == '_file_importer') return;
        const { default: _default } = (await import(filePath));
        if(!_default) return;
        Row.register(relativeFilePathWithoutExtension, {
            meta(){
                this.filePaths.push(filePath);
                this.include(_default);
            }
        });
    }
});
