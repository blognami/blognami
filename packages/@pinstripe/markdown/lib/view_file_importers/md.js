
import { readFile } from 'fs/promises';
import Yaml from 'js-yaml';

import { View } from 'pinstripe';

View.FileImporter.register('md', {
    async importFile(){
        let extractParamsPromise;

        const { filePath, relativeFilePathWithoutExtension } = this;

        const data = await readFile(filePath, 'utf8');
        const [ frontMatter, body ] = this.extractFrontMatterAndBody(data);

        View.register(relativeFilePathWithoutExtension, {
            meta(){
                this.filePaths.push(filePath);
                this.annotate(frontMatter);
            },

            async render(){
                if(!extractParamsPromise){
                    extractParamsPromise = await this.extractParams();
                }
                const params = await extractParamsPromise;

                if(this.isRoot){
                    return this.renderView('_layout', params);
                }

                return params.body;
            },

            async extractParams(){
                return { 
                    ...frontMatter, 
                    body: this.renderView('_pinstripe/_content', {
                        body: this.renderMarkdown(body, { allowHtml: true })
                    })
                };
            },
        });
    },

    extractFrontMatterAndBody(data){
        let frontMatter = {};
        let body = '';
        const matches = data.match(/^---+[\r\n]([\S\s]*?)[\r\n]---+([\S\s]*)$/)
        if(matches){
            frontMatter = Yaml.load(matches[1]);
            body = matches[2];
        } else {
            body = data;
        }
        return [ frontMatter, body ];
    }
});
