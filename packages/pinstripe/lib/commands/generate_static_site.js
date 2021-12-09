
import { VirtualNode } from '../virtual_node.js';
import { Url } from '../url.js';
import { View } from '../view.js';
import { default as mimeTypes } from 'mime-types';

export default {

    async run(){
        this.pages = {};
        const paths = Object.keys(View.classes).filter(path => !path.match(/(^|\/)_/)).map(path => {
            return `/${path.replace(/(^|\/)index$/, '')}`.replace(/^\/+/, '/');
        });

        while(paths.length){
            await this.crawlPage({ _path: paths.shift() });
        }

        const pages = Object.values(this.pages).filter(page => page.status == 200 && Object.keys(page.params).length == 1);
        const { inProjectRootDir, generateDir, generateFile, echo } = this.fsBuilder;

        await inProjectRootDir(async () => {
            await generateDir('build/static', async () => {
                while(pages.length){
                    const { params, headers } = pages.shift();
                    const contentType = headers['content-type'];

                    const path = params._path;
                    let filePath = path.replace(/^\//, '');
                    if(filePath.match(/(^|\/)$/)){
                        filePath = `${filePath}index`;
                    }
                    if(!filePath.match(/[^/]+\.[^/]+$/)){
                        filePath = `${filePath}.${mimeTypes.extension(contentType)}`
                    }
                    
                    const data = (await this.fetch({ _path: path }))[2];

                    await generateFile(filePath, () => {
                        echo(data.join(''));
                    });
                }
            });
        });
    },

    async crawlPage(params){
        const hash = JSON.stringify(params);
        if(this.pages[hash]) return;
        const page = { params };
        this.pages[hash] = page;
        const [ status, headers, data ] = await this.fetch(params);
        page.status = status;
        page.headers = headers;
        if(status != 200 || headers['content-type'] != 'text/html') return;
        const html = data.join('');
        const virtualDom = VirtualNode.fromString(html);
        const urls = this.extractUrls(virtualDom);
        while(urls.length){
            const url = urls.shift();
            await this.crawlPage({ ...url.params, _path: url.path });
        }
    },

    extractUrls(virtualDom){
        const out = [];
        virtualDom.traverse(({ attributes }) => {
            ['src', 'href'].forEach(name => {
                const value = attributes[name];
                if(!value) return;
                const url = Url.fromString(value, 'http://localhost/');
                if(url.host != 'localhost') return;
                out.push(url);
            });
        });
        return out;
    }

};
