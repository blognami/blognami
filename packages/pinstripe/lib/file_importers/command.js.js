
import { FileImporter } from "../file_importer.js";
import { Command } from "../command.js";

FileImporter.register('command.js', {
    async importFile(){
        const {relativeFilePathWithoutExtension, filePath} = this;
        if(!filePath.match(/\/[^\.\/]+\.js$/)) return;
        if(relativeFilePathWithoutExtension == '_file_importer') return;
        const { default: _default } = (await import(filePath));
        if(!_default) return;
        Command.register(relativeFilePathWithoutExtension, {
            meta(){
                this.filePaths.push(filePath);
                this.include(_default);
            }
        });
    }
});
