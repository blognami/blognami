
export const styles = `
    .form {
        display: block;
    }

    .field:not(:first-of-type) {
        margin-top: 1em;
    }

    .field-header {
        display: flex;
        gap: 1em;
        margin-bottom: 0.5em;
    }

    .overlay-links {
        flex-grow: 1;
        display: flex;
        align-items: end;
        justify-content: end;
        font-size: 0.8em;
    }

    .overlay-link:not(:first-of-type) {
        margin-left: 1em;
    }

    .label {
        color: #363636;
        display: block;
        font-size: 1.6rem;
        font-weight: 700;
    }
    
    .label a {
        text-decoration: underline;
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

    .input + .is-error {
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

    .footer {
        display: flex;
        align-items: center;
    }

    .loading-indicator {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: start;
        font-size: 11px;
        gap: 0.5em;
    }

    .proof-of-work-progress {
        display: inline-block;
    }
`;

export const decorators = {
    proofOfWorkProgress(){
        this.frame.on('proofOfWorkProgress', e => {
            const progress = e.detail;
            this.patch({
                ...this.attributes,
                value: progress
            });
            this.patch(`${progress} %`);
        });
    }
};

export default {
    render(){
        const {
            unsavedChangesConfirm,
            requiresProofOfWork,
            isPlaceholder,
            method,
            title,
            otherErrors,
            fields,
            submitTitle,
            cancelTitle,
            class: _class,
            width = 'medium',
            height = 'auto'
        } = this.params;

        return this.renderHtml`
            <pinstripe-modal width="${width}" height="${height}">
                <form
                    class="${this.cssClasses.form}${_class ? ` ${_class}` : ''}"
                    method="post"
                    enctype="multipart/form-data"
                    autocomplete="off"
                    ${unsavedChangesConfirm ? this.renderHtml`data-unsaved-changes-confirm="${unsavedChangesConfirm}"` : undefined}
                    ${unsavedChangesConfirm && method == 'POST' ? this.renderHtml`data-has-unsaved-changes="true"` : undefined}
                    ${requiresProofOfWork ? this.renderHtml`data-requires-proof-of-work="true"` : undefined}
                    data-placeholder="&_placeholder=true"
                    ${isPlaceholder ? this.renderHtml`disabled` : ''}
                >
                    ${this.renderView('_sintra/_panel', {
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
                            ${fields.map(({ label, name, type, value, component, placeholder, overlayLinks, watch, error, ...rest }) => {
                                if(type == 'hidden'){
                                    return this.renderHtml`
                                        <input type="hidden" name="${name}" value="${value}">
                                    `;
                                }
                                return this.renderHtml`
                                    <div class="${this.cssClasses.field}">
                                        <div class="${this.cssClasses.fieldHeader}">
                                            <label class="${this.cssClasses.label}">${label}</label>
                                            ${() => {
                                                if(!overlayLinks) return;
                                                return this.renderHtml`
                                                    <div class="${this.cssClasses.overlayLinks}">
                                                        ${overlayLinks.map(({ body, ...attributes }) => this.renderHtml`
                                                            <a ${() => {
                                                                attributes.target ??= '_overlay';
                                                                attributes.class ??= this.cssClasses.overlayLink;

                                                                const out = [];
                                                                for(let [key, value] of Object.entries(attributes)){
                                                                    out.push(this.renderHtml`${key}="${value}"`);
                                                                }
                                                                return out;
                                                            }}>${body}</a>
                                                        `)}
                                                    </div>
                                                `;
                                            }}
                                        </div>
                                        ${() => {
                                            const input = (() => {
                                                if(type.match(/(^|\/)_[^\/]+(|\/index)$/)){
                                                    return this.renderView(type, { label, name, type, value, component, placeholder, error, cssClasses: this.cssClasses, ...rest });
                                                }
                                                if(type == 'select'){
                                                    const { options = {} } = rest;
                                                    return this.renderHtml`
                                                        <select class="${this.cssClasses.input}${error ? ` ${this.cssClasses.isError}` : ''}" name="${name}">
                                                            ${Object.entries(options).map(([optionValue, optionLabel]) => this.renderHtml`
                                                                <option value="${optionValue}"${optionValue == value ? this.renderHtml` selected="selected"` : ''}>${optionLabel}</option>
                                                            `)}
                                                        </select>
                                                    `;
                                                }
                                                if(type == 'textarea'){
                                                    return this.renderHtml`
                                                        <textarea class="${this.cssClasses.textarea}${error ? ` ${this.cssClasses.isError}` : ''}" name="${name}"${component ? this.renderHtml` data-component="${component}"` : undefined}${placeholder ? this.renderHtml` placeholder="${placeholder}"` : undefined}>${value}</textarea>
                                                    `;
                                                }
                                                if(type == 'checkbox'){
                                                    return this.renderHtml`
                                                        <input class="${this.cssClasses.input}${error ? ` ${this.cssClasses.isError}` : ''}" type="checkbox" name="${name}" type="${type}" ${value ? 'checked' : ''}${component ? this.renderHtml` data-component="${component}"` : undefined} data-watch="${watch ? 'true' : 'false'}">
                                                    `;
                                                }
                                                return this.renderHtml`
                                                    <input class="${this.cssClasses.input}${error ? ` ${this.cssClasses.isError}` : ''}" name="${name}" type="${type}" value="${value}"${component ? this.renderHtml` data-component="${component}"` : undefined}${placeholder ? this.renderHtml` placeholder="${placeholder}"` : undefined}>
                                                `;
                                            })();

                                            if(isPlaceholder) return this.renderHtml`
                                                <pinstripe-skeleton>${input}</pinstripe-skeleton>
                                            `;
                                            
                                            return input;
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
                            <div class="${this.cssClasses.footer}">
                                ${this.renderView('_sintra/_button', {
                                    type: 'submit',
                                    body: submitTitle
                                })}
                                ${this.renderView('_sintra/_button', {
                                    body: this.renderHtml`
                                        ${cancelTitle}
                                        <script type="pinstripe">
                                            this.parent.on('click', () => this.trigger('close'));
                                        </script>
                                    `
                                })}
                                ${() => {
                                    if(isPlaceholder && requiresProofOfWork) return this.renderHtml`
                                        <span class="${this.cssClasses.loadingIndicator}">
                                            Generating anti-spam code <progress class="${this.cssClasses.proofOfWorkProgress}" max="100">0.0 %</progress>
                                        </span>
                                    `;
                                }}
                            </div>
                        `
                    })}
                </form>
            </pinstripe-modal>
        `;
    }
};
