
import { FileImporter } from "../file_importer.js";

FileImporter.register('default.js', {
    async importFile(){
        if(!this.filePath.match(/\/[^\.\/]+\.js$/)) return;
        await import(this.filePath);
    }
});
