
import { ValidationError } from '../validation_error.js';
import { Inflector } from '../inflector.js';

export default {
    create(){
        return (...args) => this.render(...args);
    },

    async render(formAdaptable, options = {}){
        const formAdapter = await formAdaptable.toFormAdapter();
        
        const values = {};
        normalizeFields(options.fields || formAdapter.fields).forEach(({ name }) => {
            values[name] = this.params[name];
        });

        const success = options.success || (() => {});

        const errors = {};
        if(this.params._method == 'POST'){
            try {
                return await formAdapter.submit(values, success) || this.renderHtml`
                    <span data-component="a" data-target="_parent">
                        <script type="blognami">this.parent.trigger('click');</script>
                    </span>
                `;
            } catch(e){
                if(!(e instanceof ValidationError)){
                    throw e;
                }
                Object.assign(errors, e.errors);
            }
        }

        const title = options.title || formAdapter.title;
        const fields = extractFields(formAdapter, options);
        const submitTitle = options.submitTitle || formAdapter.submitTitle;
        const cancelTitle = options.cancelTitle || formAdapter.cancelTitle;
        const unsavedChangesConfirm = options.unsavedChangesConfirm || formAdapter.unsavedChangesConfirm;

        const indexedFields = indexFieldsByName(fields);
        const otherErrors = [];
        Object.keys(errors).forEach(name => {
            const error = errors[name];
            if(indexedFields[name] && indexedFields[name].type != 'hidden'){
                indexedFields[name].error = error;
            } else {
                otherErrors.push(name != 'general' ? `(${name}) ${error}` : error);
            }
        });

        fields.forEach(field => {
            const value = values[field.name];
            if(value !== undefined){
                field.value = value;
            }
        });

        return this.renderHtml`
            <blognami-modal>
                <form
                    class="card"
                    method="post"
                    enctype="multipart/form-data"
                    autocomplete="off"
                    ${unsavedChangesConfirm ? this.renderHtml`data-unsaved-changes-confirm="${unsavedChangesConfirm}"` : undefined}
                    ${unsavedChangesConfirm && this.params._method == 'POST' ? this.renderHtml`data-has-unsaved-changes="true"` : undefined}
                >
                    <div class="card-header">
                        <p class="card-header-title">${title}</p>
                    </div>
                    <div class="card-body">
                        ${() => {
                            if(otherErrors.length){
                                return this.renderHtml`
                                    <div class="field">
                                        ${otherErrors.map(error => this.renderHtml`
                                            <p class="is-error">${error}</p>
                                        `)}
                                    </div>
                                `
                            }
                        }}
                        ${fields.map(({ label, name, type, value, component, placeholder, error }) => {
                            if(type == 'hidden'){
                                return this.renderHtml`
                                    <input type="hidden" name="${name}" value="${value}">
                                `;
                            }
                            return this.renderHtml`
                                <div>
                                    <label class="label">${label}</label>
                                    ${() => {
                                        if(type == 'textarea'){
                                            return this.renderHtml`
                                                <textarea class="textarea${error ? ' is-error' : ''}" name="${name}"${component ? this.renderHtml` data-component="${component}"` : undefined}${placeholder ? this.renderHtml` placeholder="${placeholder}"` : undefined}>${value}</textarea>
                                            `;
                                        }
                                        if(type == 'checkbox'){
                                            return this.renderHtml`
                                                <input class="input${error ? ' is-error' : ''}" type="checkbox" name="${name}" type="${type}" ${value ? 'checked' : ''}${component ? this.renderHtml` data-component="${component}"` : undefined}>
                                            `;
                                        }
                                        return this.renderHtml`
                                            <input class="input${error ? ' is-error' : ''}" name="${name}" type="${type}" value="${value}"${component ? this.renderHtml` data-component="${component}"` : undefined}${placeholder ? this.renderHtml` placeholder="${placeholder}"` : undefined}>
                                        `;
                                    }}
                                    ${() => {
                                        if(error){
                                            return this.renderHtml`
                                                <p class="is-error">${error}</p>
                                            `;
                                        }
                                    }}
                                </div>
                            `;
                        })}
                    </div>
                    <div class="card-footer">
                        <button class="button" type="submit">${submitTitle}</button>
                        <button class="button" type="button">
                            ${cancelTitle}
                            <script type="blognami">
                                this.parent.on('click', () => this.trigger('close'));
                            </script>
                        </button>
                    </div>
                </form>
            </blognami-modal>
        `;
    }
}

const normalizeFields = (fields) => fields.map(field => {
    let out = field;
    if(typeof out != 'object'){
        out = { name: `${field}` };
    }
    return out;
});

const indexFieldsByName = (fields) => {
    const out = {};
    fields.forEach(field => {
        out[field.name] = field;
    });
    return out;
};

const extractFields = (formAdapter, options) => {
    const normalizedFormAdapterFields = normalizeFields(formAdapter.fields);
    const normalizedOptionsFields = options.fields ? normalizeFields(options.fields) : normalizedFormAdapterFields;
    const indexedNormalizedFormAdapterFields = indexFieldsByName(normalizedFormAdapterFields);
    return normalizedOptionsFields.map(optionsField => {
        const out = {};
        const formAdapterField = indexedNormalizedFormAdapterFields[optionsField.name] || {};
        out.name = optionsField.name;
        out.label = optionsField.label || formAdapterField.label || Inflector.instance.capitalize(out.name);
        out.type = optionsField.type || formAdapterField.type || 'text';
        out.component = optionsField.component || formAdapterField.component;
        out.placeholder = optionsField.placeholder || formAdapterField.placeholder;
        out.value = optionsField.value || formAdapterField.value;
        return out;
    });
};

