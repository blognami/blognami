
export default {
    async render(){
        const { language = 'en', meta = [], body } = this.params;

        const version = await this.version;

        const urlSearchParams = new URLSearchParams({ version });

        const versionedMeta = [
            { tagName: 'link', rel: 'stylesheet', href: `/_sintra/_shell/stylesheets/all.css?${urlSearchParams}` },
            { tagName: 'script', src: `/_sintra/_shell/javascripts/window.js?${urlSearchParams}` },
            { tagName: 'meta', name: 'sintra-service-worker-url', content: `/_sintra/_shell/javascripts/service_worker.js?${urlSearchParams}` },
        ];

        return this.renderHtml`
            <!DOCTYPE html>
            <html lang="${language}">
                <head>
                    ${this.mergeMeta([ ...this.defaultMeta, ...versionedMeta, ...meta ]).map(attributes => this.renderTag(attributes))}
                </head>
                <body>
                    ${body}
                </body>
            </html>
        `;
    },

    defaultMeta: [
        { tagName: 'meta', charset: 'utf-8' },
        { tagName: 'meta', name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { tagName: 'meta', name: 'pinstripe-load-cache-namespace', content: 'default' },
    ],

    mergeMeta(meta){
        let out = {};
        this.normalizeMeta(meta).forEach(({ tagName, ...attributes }) => {
            if(tagName == 'title'){
                out['0:title'] = { tagName, ...attributes };
            } else if(tagName == 'meta' && attributes.name){
                out[`1:meta:name:${attributes.name}`] = { tagName, ...attributes };
            } else if(tagName == 'meta' && attributes.property){
                out[`1:meta:property:${attributes.property}`] = { tagName, ...attributes };
            } else if(tagName == 'meta' && attributes['http-equiv']){
                out[`1:meta:http-equiv:${attributes['http-equiv']}`] = { tagName, ...attributes };
            } else if(tagName == 'meta' && attributes.charset){
                out['1:meta:charset'] = { tagName, ...attributes };
            } else {
                out[`2:${JSON.stringify({ tagName, ...attributes })}`] = { tagName, ...attributes };
            }
        });
        out = Object.entries(out);
        out.sort(([ a ], [ b ]) => a.localeCompare(b));
        return out.map(([ key, value ]) => value);
    },

    normalizeMeta(meta){
        return meta.map(({ tagName, title, ...otherAttributes }) => {
            if(!tagName && title) return { tagName: 'title', body: title, ...otherAttributes };
            return { tagName: tagName ?? 'meta', title, ...otherAttributes };
        });
    }
};
