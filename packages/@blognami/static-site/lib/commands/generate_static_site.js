
import { default as mimeTypes } from 'mime-types';

import { View } from 'blognami';

export default {
    async run(){
        this.pages = {};
        const urls = View.names.filter(path => !path.match(/(^|\/)_/)).map(path => {
            return new URL(path, 'http://127.0.0.1/');
        });

        urls.push(new URL('http://127.0.0.1/404'));

        while(urls.length){
            await this.crawlPage({ _url: urls.shift() });
        }

        const pages = Object.values(this.pages).filter(page => {
            const { _method, _url, _headers, ...otherParams } = page.params;
            return _url.pathname == '/404' || (page.status == 200 && !Object.keys(otherParams).length)
        });

        const { inProjectRootDir, generateDir, generateFile } = this.fsBuilder;

        const isGenerated = {};

        await inProjectRootDir(async () => {
            await generateDir('build/static', async () => {
                while(pages.length){
                    const { params, headers } = pages.shift();
                    const contentType = headers['content-type'];

                    const path = params._url.pathname;
                    let filePath = path.replace(/^\//, '');
                    if(filePath.match(/(^|\/)$/)){
                        filePath = `${filePath}index`;
                    }
                    if(!filePath.match(/[^/]+\.[^/]+$/)){
                        filePath = `${filePath}.${mimeTypes.extension(contentType)}`
                    }
                    
                    const data = (await this.callHandler.handleCall({ _url: new URL(path, 'http://127.0.0.1/') }))[2];

                    if(!isGenerated[filePath]){
                        isGenerated[filePath] = true;
                        await generateFile(filePath, ({ echo }) => {
                            echo(data.join(''));
                        });    
                    }
                }
            });
        });
    },

    async crawlPage(params){
        const hash = JSON.stringify(params);
        if(this.pages[hash]) return;
        const page = { params };
        this.pages[hash] = page;
        const [ status, headers, data ] = await this.callHandler.handleCall(params);
        page.status = status;
        page.headers = headers;
        if(status != 200 || headers['content-type'] != 'text/html') return;
        const html = data.join('');
        const virtualDom = this.parseHtml(html);
        const urls = this.extractUrls(virtualDom);
        while(urls.length){
            const url = urls.shift();
            await this.crawlPage({ ...url.params, _headers: params._headers, _url: url });
        }
    },

    extractUrls(virtualDom){
        const out = [];
        virtualDom.traverse(({ attributes }) => {
            ['src', 'href'].forEach(name => {
                const value = attributes[name];
                if(!value) return;
                const url = new URL(value, 'http://127.0.0.1/');
                if(url.host != '127.0.0.1') return;
                out.push(url);
            });
        });
        return out;
    }
};
