import { basename } from 'node:path';
import { Playbook } from 'sartor';

Playbook.FileImporter.register('md', {
    async importFile(){
        if(basename(this.filePath) !== 'index.md') return;
        const name = this.relativeFilePathWithoutExtension.replace(/(^|\/)index$/, '');
        if(!name) return;
        const { filePath } = this;
        Playbook.register(name, {
            meta(){
                this.filePaths.push(filePath);
            }
        });
    }
});
