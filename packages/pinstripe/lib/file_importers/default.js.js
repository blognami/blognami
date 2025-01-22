
import { FileImporter } from "../file_importer.js";

FileImporter.register('default.js', {
    async importFile(){
        await import(this.filePath);
    }
});

FileImporter.register('default.test.js', {});
