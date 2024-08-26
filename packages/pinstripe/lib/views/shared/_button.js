
export const styles = `
    .root {
        appearance: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0.1rem solid transparent;
        border-radius: 0.4rem;
        font-size: 1.6rem;
        height: 2.5em;
        line-height: 1.5;
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
    .root.is-dangerous {
        background-color: #c70000;
        border-color: transparent;
        color: #fff;
    }
    .root.is-dangerous:hover {
        background-color: #c40000;
        border-color: transparent;
        color: #fff;
    }
    .root.is-full-width {
        width: 100%;
    }
    root.is-small {
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
        let { tagName = 'button', isPrimary, isDangerous, isFullWidth, size = 'medium', ...attributes } = this.params;

        tagName = tagName.toLowerCase();
        
        if(tagName === 'button'){
            attributes.type ??= 'button';
            if(attributes.type == 'submit') isPrimary ??= true;
        }

        const classes = [
            this.cssClasses.root,
            `is-${size}`,
        ];

        if(isPrimary) classes.push(this.cssClasses.isPrimary);

        if(isDangerous) classes.push(this.cssClasses.isDangerous);

        if(isFullWidth) classes.push(this.cssClasses.isFullWidth);
        
        return this.renderTag(tagName, { ...attributes, class: classes.join(' ') });
    }
};
