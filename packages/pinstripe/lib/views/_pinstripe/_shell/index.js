
export const styles = ({ colors, fonts }) => `
    /* Box sizing rules */
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    /* Remove the default font size and weight for headings */

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-size: inherit;
        font-weight: inherit;
    }

    /* Reset links to optimize for opt-in styling instead of opt-out*/

    a {
        color: inherit;
        -webkit-text-decoration: inherit;
        text-decoration: inherit;
    }

    /* Remove default margin */
    body,
    h1,
    h2,
    h3,
    h4,
    p,
    figure,
    blockquote,
    dl,
    dd {
        margin: 0;
    }

    /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
    ul[role="list"],
    ol[role="list"] {
        list-style: none;
    }

    /* Set core root defaults */
    html:focus-within {
        scroll-behavior: smooth;
    }

    /* Set core body defaults */
    body {
        min-height: 100vh;
        line-height: 1.5;
        text-rendering: optimizespeed;
    }

    /* A elements that don't have a class get default styles */
    a:not([class]) {
        text-decoration-skip-ink: auto;
    }

    /* Make images easier to work with */
    img,
    picture {
        display: block;
        max-width: 100%;
    }

    /* Inherit fonts for inputs and buttons */
    input,
    button,
    textarea,
    select {
        font: inherit;
    }

    /* Remove all animations and transitions for people that prefer not to see them */
    @media (prefers-reduced-motion: reduce) {
        html:focus-within {
            scroll-behavior: auto;
        }

        *,
        *::before,
        *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
        }
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes ping {
        75%,
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes pulse {
        50% {
            opacity: 0.5;
        }
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
            transform: none;
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
    }

    html {
        font-size: 62.5%;
    }

    body {
        font-family: ${fonts.sans};
        font-size: 1.6rem;
        line-height: 1.6;
        color: ${colors.semantic.primaryText};
        background-color: #fff;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`;

export default {
    async render(){
        const { language = 'en', meta = [], body } = this.params;

        const version = await this.version;

        const urlSearchParams = new URLSearchParams({ version });

        const versionedMeta = [
            { tagName: 'link', rel: 'stylesheet', href: `/_pinstripe/_shell/styles.css?${urlSearchParams}` },
            { tagName: 'script', src: `/_pinstripe/_shell/window.js?${urlSearchParams}` },
            { tagName: 'meta', name: 'pinstripe-service-worker-url', content: `/service_worker.js?${urlSearchParams}` },
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
