
export const styles = `
    .root {
        border-width: 0 0 0.1rem 0;
        border-style: solid;
        border-color: var(--color-light-gray);
        padding-left: 1em;
        padding-right: 1em;
    }
    
    .inner {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        min-height: 3em;
    }
    
    .branding {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        font-weight: 600;
    }
    
    .links {
        flex: 1 1 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 1em;
    }
    
    .burger {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 2em;
        height: 2em;
        cursor: pointer;
        gap: 0.3em;
        background: none;
        border: none;
        padding: 0;
    }

    .burger > span {
        display: block;
        width: 1.5em;
        height: 0.2em;
        background: var(--color-dark-gray, #333);
        border-radius: 2px;
        transition: all 0.3s;
    }

    @media (max-width: 768px) {
        .links > * {
            display: none;
        }
        
        .burger {
            display: flex;
        }
    }
`;

export default {
    render(){
        return this.renderHtml`
            <div class="${this.cssClasses.root}" data-test-id="navbar">
                <div class="${this.cssClasses.inner}">
                    <div class="${this.cssClasses.branding}">
                        ${this.renderView('_navbar/_branding')}
                    </div>
                    <div class="${this.cssClasses.links}">
                        ${this.renderView('_navbar/_links')}
                        <a class="${this.cssClasses.burger}" href="/_navbar/burger_menu" target="_overlay" data-test-id="navbar-burger">
                            <span></span>
                            <span></span>
                            <span></span>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
};


// ${links.map(({ body, href, target = '_top', preload, testId}) => {
//     return this.renderHtml`
//         <a class="${this.cssClasses.item}" href="${href}" target="${target}" ${preload ? 'data-preload' : ''} data-test-id="${testId}">${body}</a>
//     `;
// })}