
export const styles = `
    .root {
        appearance: none;
        display: inline-flex;
        align-items: center;
        vertical-align: top;
        justify-content: center;
        border: 0.1rem solid transparent;
        border-radius: 0.4rem;
        box-shadow: none;
        font-size: 1.6rem;
        height: 2.5em;
        line-height: 1.5;
        position: relative;
        background-color: white;
        border-color: #dbdbdb;
        border-width: 0.1rem;
        color: #363636;
        cursor: pointer;
        padding: calc(0.5em - 0.1rem) 1em;
        text-align: center;
        white-space: nowrap;
    }
    .root:hover {
        border-color: #b5b5b5;
        color: #363636;
    }
    .root:not(:last-child) {
        margin-right: 0.5em;
    }
    .root.is-primary {
        background-color: #48c78e;
        border-color: transparent;
        color: #fff;
    }
    .root.is-primary:hover {
        background-color: #00c4a7;
        border-color: transparent;
        color: #fff;
    }
    .is-small {
        font-size: 1.2rem;
        height: 1.5em;
        padding-bottom: 0.5em;
        padding-left: 0.5em;
        padding-right: 0.5em;
        padding-top: 0.5em;
    }
`;

export default {
    render(){
        let { nodeName = 'button', body, isPrimary, size = 'medium', ...attributes } = this.params;

        nodeName = nodeName.toLowerCase();
        
        if(nodeName === 'button'){
            attributes.type ??= 'button';
            if(attributes.type == 'submit') isPrimary ??= true;
        }
        
        return this.renderHtml`
            <${nodeName} class="${this.cssClasses.root} ${this.cssClasses[`is-${size}`]} ${isPrimary ? this.cssClasses.isPrimary : ''}" ${() => {
                const out = [];
                for(let [key, value] of Object.entries(attributes)){
                    out.push(this.renderHtml`${key}="${value}"`);
                }
                return out;
            }}>${body}</${nodeName}>
        `;
    }
};
