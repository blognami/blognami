
export const styles = `
    .label {
        color: #363636;
        display: block;
        font-size: 1.6rem;
        font-weight: 700;
    }

    .label:not(:last-child) {
        margin-bottom: 0.5em;
    }

    .input:not([type='checkbox']) {
        -moz-appearance: none;
        -webkit-appearance: none;
        align-items: center;
        border: 0.1rem solid transparent;
        border-radius: 0.4rem;
        box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
        display: inline-flex;
        font-size: 1.6rem;
        height: 2.5em;
        justify-content: flex-start;
        line-height: 1.5;
        padding-bottom: calc(0.5em - 0.1rem);
        padding-left: calc(0.75em - 0.1rem);
        padding-right: calc(0.75em - 0.1rem);
        padding-top: calc(0.5em - 0.1rem);
        position: relative;
        vertical-align: top;
        background-color: white;
        border-color: #dbdbdb;
        color: #363636;
        max-width: 100%;
        width: 100%;
    }

    .input:not([type='checkbox']):focus {
        outline: none;
        border-color: #485fc7;
        box-shadow: 0 0 0 0.125em rgb(72 95 199 / 25%);
    }

    .input:not([type='checkbox']).is-error {
        border-color: #f14668;
    }

    .input:not([type='checkbox']).is-error:focus {
        outline: none;
        box-shadow: 0 0 0 0.125em rgb(241 70 104 / 25%);
    }

    .input:not([type='checkbox']) + .is-error {
        font-size: 1.2rem;
        margin-top: 0.25rem;
    }

    .textarea {
        border: 0.1rem solid #dbdbdb;
        width: 100%;
        min-height: 7em;
        border-radius: 0.4rem;
        padding-bottom: calc(0.5em - 0.1rem);
        padding-left: calc(0.75em - 0.1rem);
        padding-right: calc(0.75em - 0.1rem);
        padding-top: calc(0.5em - 0.1rem);
    }

    .is-error:not(input):not(textarea) {
        color: #f14668;
        display: block;
    }
`;

export default {
    render(){
        const { 
            unsavedChangesConfirm,
            method,
            title,
            otherErrors,
            fields,
            submitTitle,
            cancelTitle
        } = this.params;

        return this.renderHtml`
            <pinstripe-modal>
                <form
                    method="post"
                    enctype="multipart/form-data"
                    autocomplete="off"
                    ${unsavedChangesConfirm ? this.renderHtml`data-unsaved-changes-confirm="${unsavedChangesConfirm}"` : undefined}
                    ${unsavedChangesConfirm && method == 'POST' ? this.renderHtml`data-has-unsaved-changes="true"` : undefined}
                >
                    ${this.renderView('_panel', {
                        title,
                        body: this.renderHtml`
                            ${() => {
                                if(otherErrors.length){
                                    return this.renderHtml`
                                        <div>
                                            ${otherErrors.map(error => this.renderHtml`
                                                <p class="${this.cssClasses.isError}">${error}</p>
                                            `)}
                                        </div>
                                    `
                                }
                            }}
                            ${fields.map(({ label, name, type, value, component, placeholder, error, ...rest }) => {
                                if(type == 'hidden'){
                                    return this.renderHtml`
                                        <input type="hidden" name="${name}" value="${value}">
                                    `;
                                }
                                return this.renderHtml`
                                    <div>
                                        <label class="${this.cssClasses.label}">${label}</label>
                                        ${() => {
                                            if(type.match(/(^|\/)_/)){
                                                return this.renderView(type, { label, name, type, value, component, placeholder, error, cssClasses: this.cssClasses, ...rest });
                                            }
                                            if(type == 'textarea'){
                                                return this.renderHtml`
                                                    <textarea class="${this.cssClasses.textarea}${error ? ` ${this.cssClasses.isError}` : ''}" name="${name}"${component ? this.renderHtml` data-component="${component}"` : undefined}${placeholder ? this.renderHtml` placeholder="${placeholder}"` : undefined}>${value}</textarea>
                                                `;
                                            }
                                            if(type == 'checkbox'){
                                                return this.renderHtml`
                                                    <input class="${this.cssClasses.input}${error ? ` ${this.cssClasses.isError}` : ''}" type="checkbox" name="${name}" type="${type}" ${value ? 'checked' : ''}${component ? this.renderHtml` data-component="${component}"` : undefined}>
                                                `;
                                            }
                                            return this.renderHtml`
                                                <input class="${this.cssClasses.input}${error ? ` ${this.cssClasses.isError}` : ''}" name="${name}" type="${type}" value="${value}"${component ? this.renderHtml` data-component="${component}"` : undefined}${placeholder ? this.renderHtml` placeholder="${placeholder}"` : undefined}>
                                            `;
                                        }}
                                        ${() => {
                                            if(error){
                                                return this.renderHtml`
                                                    <p class="${this.cssClasses.isError}">${error}</p>
                                                `;
                                            }
                                        }}
                                    </div>
                                `;
                            })}
                        `,
                        footer: this.renderHtml`
                            ${this.renderView('_button', {
                                type: 'submit',
                                body: submitTitle
                            })}
                            ${this.renderView('_button', {
                                body: this.renderHtml`
                                    ${cancelTitle}
                                    <script type="pinstripe">
                                        this.parent.on('click', () => this.trigger('close'));
                                    </script>
                                `
                            })}
                        `
                    })}
                </form>
            </pinstripe-modal>
        `;
    }
};
