
export default {
    render(){
        const { language = 'en', meta = [], body } = this.params;

        return this.renderHtml`
            <!DOCTYPE html>
            <html lang="${language}">
                <head>
                    ${this.mergeMeta([ ...this.defaultMeta, ...meta ]).map(attributes => this.renderTag(attributes))}
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
        { tagName: 'link', rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { tagName: 'link', rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        { tagName: 'link', rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Inter:wght@400;500;600;700;800&display=swap' },
        { tagName: 'link', rel: 'stylesheet', href: '/_pinstripe/_shell/stylesheets/all.css' },
        { tagName: 'script', src: '/_pinstripe/_shell/javascripts/window.js' }
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
