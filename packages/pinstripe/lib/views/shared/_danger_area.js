
export const styles = `
    .root {
        border-width: 0.1rem;
        border-style: dashed;
    }

    .root[data-is-open="true"] {
        border-color: #c70000;
        border-style: solid;
    }

    .root:not(:first-child){ margin-top: 2em; }

    .header { display: flex; }

    .title {
        flex-grow: 1;
        font-weight: bold;
    }
    .root[data-is-open="true"] .title { color: #c70000; }

    .body, .header { padding: 0.7rem; }
    
    .open, .close { cursor: pointer; }

    .open { display: block; }
    .root[data-is-open="true"] .open { display: none; }

    .close { display: none; }
    .root[data-is-open="true"] .close { display: block; }

    .body { display: none; }
    .root[data-is-open="true"] .body { display: block; }

    .body > * + * { margin-top: 2rem; }
`;

export const decorators = {
    toggle(){
        this.on('click', () => {
            const root = this.parent.parent;
            if(root.attributes['data-is-open'] == 'true'){
                root.patch({
                    ...root.attributes,
                    'data-is-open': 'false'
                });
            } else {
                root.patch({
                    ...root.attributes,
                    'data-is-open': 'true'
                });
            }
        });
    }
};


export default {
    render(){
        const { body, testId = 'toggle-danger-area' } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}" data-is-open="false">
                <div class="${this.cssClasses.header}">
                    <div class="${this.cssClasses.title}">Danger Area</div>
                    <div class="${this.cssClasses.toggle}" ${testId ? this.renderHtml`data-test-id="${testId}"` : ''}>
                        <div class="${this.cssClasses.open}">Open</div>
                        <div class="${this.cssClasses.close}">Close</div>
                    </div>
                </div>
                <div class="${this.cssClasses.body}">
                    ${body}
                </div>
            </div>
        `;
    }
};
