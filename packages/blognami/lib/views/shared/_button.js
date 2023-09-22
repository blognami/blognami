
export default {
    styles: `
        .root {
            -moz-appearance: none;
            -webkit-appearance: none;
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
            padding-bottom: calc(0.5em - 0.1rem);
            padding-left: 1em;
            padding-right: 1em;
            padding-top: calc(0.5em - 0.1rem);
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
    `,
    
    render(){
        const { body, type = 'button' } = this.params;
        const { isPrimary = type == 'submit' } = this.params;
        
        return this.renderHtml`
            <button class="${this.cssClasses.root} ${isPrimary ? this.cssClasses.isPrimary : ''}" type="${type}">
                ${body}
            </button>
        `;
    }
};
