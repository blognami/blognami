
import { promisify } from 'util';
import { readFile } from 'fs';
import Yaml from 'js-yaml';

import { View } from '../view.js';

View.FileImporter.register('md', {
    importFile({ relativeFilePathWithoutExtension, filePath }){
        let extractParamsPromise;

        View.register(relativeFilePathWithoutExtension, {
            async render(){
                if(!extractParamsPromise){
                    extractParamsPromise = await this.extractParams();
                }
                const params = await extractParamsPromise;
                return this.renderView('_layout', params);
            },

            async extractParams(){
                const data = await promisify(readFile)(filePath, 'utf8');
                const [ frontMatter, body ] = this.extractFrontMatterAndBody(data);
                const renderedBody = await this.renderMarkdown(body);
                return { ...frontMatter, body: renderedBody };
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
    }
});
