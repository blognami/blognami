
import { promisify } from 'util';
import { readFile } from 'fs';
import Handlebars from 'handlebars';

import { View } from '../view.js';

View.FileImporter.register('hbs', {
    importFile({ relativeFilePathWithoutExtension, filePath }){
        let compileTemplatePromise;

        View.register(relativeFilePathWithoutExtension, {
            async render(){
                if(!compileTemplatePromise){
                    compileTemplatePromise = await this.compileTemplate();
                }
                const template = await compileTemplatePromise;
                return this.renderHtml(template(this.params));
            },

            async compileTemplate(){
                const template = await promisify(readFile)(filePath, 'utf8');
                return Handlebars.compile(template);
            },
        });
    }
});
