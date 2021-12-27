
import { ValidationError } from '../validation_error.js';
import { capitalize } from '../inflector.js';
import { Base } from '../base.js';
import { Validatable } from '../validatable.js';

export default {
    create(){
        return (...args) => this.render(...args);
    },

    render(...args){
        const { _part } = this.params;
        if(_part == 'markdown-editor'){
            return this.renderMarkdownEditor();
        }
        if(_part == 'markdown-editor-preview'){
            return this.renderMarkdownEditorPreview();
        }
        return this.renderForm(...args);
    },

    async renderForm(formAdaptable, options = {}){
        const { params, renderHtml } = this;

        const formAdapter = await (typeof formAdaptable.toFormAdapter == 'function' ? formAdaptable.toFormAdapter() : createObjectFormAdapter(formAdaptable));
        
        const values = {};
        normalizeFields(options.fields || formAdapter.fields).forEach(({ name }) => {
            values[name] = params[name];
        });

        const success = options.success || (() => {});

        const errors = {};
        if(params._method == 'POST'){
            try {
                return await formAdapter.submit(values, success) || renderHtml`
                    <span data-action="load" data-target="_parent"></span>
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

        return renderHtml`
            <div class="modal is-active">
                <div class="modal-background" data-widget="trigger" data-event="click" data-action="remove"></div>
                <div class="modal-card">
                    <form method="post" enctype="multipart/form-data" autocomplete="off">
                        <header class="modal-card-head">
                            <p class="modal-card-title">${title}</p>
                            <button type="button" class="delete" aria-label="close" data-widget="trigger" data-event="click" data-action="remove"></button>
                        </header>
                        <section class="modal-card-body">
                            ${() => {
                                if(otherErrors.length){
                                    return renderHtml`
                                        <div class="field">
                                            ${otherErrors.map(error => renderHtml`
                                                <p class="help is-danger">${error}</p>
                                            `)}
                                        </div>
                                    `
                                }
                            }}
                            ${fields.map(({ label, name, type, value, error }) => {
                                if(type == 'hidden'){
                                    return renderHtml`
                                        <input type="hidden" name="${name}" value="${value}">
                                    `;
                                }
                                return renderHtml`
                                    <div class="field">
                                        <label class="label">${label}</label>
                                        <div class="control">
                                            ${() => {
                                                if(type == 'textarea'){
                                                    return renderHtml`
                                                        <textarea class="textarea${error ? ' is-danger' : ''}" name="${name}">${value}</textarea>
                                                    `
                                                }
                                                if(type == 'markdown'){
                                                    return renderHtml`
                                                        <textarea class="textarea${error ? ' is-danger' : ''}" name="${name}" data-widget="trigger" data-event="click" data-action="load" data-target="_overlay" data-url="&_part=markdown-editor">${value}</textarea>
                                                    `
                                                }
                                                if(type == 'checkbox'){
                                                    return renderHtml`
                                                        <input class="checkbox${error ? ' is-danger' : ''}" type="checkbox" name="${name}" type="${type}" ${value ? 'checked' : ''} />
                                                    `
                                                }
                                                return renderHtml`
                                                    <input class="input${error ? ' is-danger' : ''}" name="${name}" type="${type}" value="${value}">
                                                ` 
                                            }}
                                        </div>
                                        ${() => {
                                            if(error){
                                                return renderHtml`
                                                    <p class="help is-danger">${error}</p>
                                                `
                                            }
                                        }}
                                    </div>
                                `;
                            })}
                        </section>
                        <footer class="modal-card-foot">
                            <button class="button is-success" type="submit">${submitTitle}</button>
                            <button class="button" data-action="remove">${cancelTitle}</button>
                        </footer>
                    </form>
                </div>
            </div>
        `;
    },

    async renderMarkdownEditor(){
        const { renderHtml, params } = this;
        const { value = '' } = params;

        return renderHtml`
            <div class="modal is-active">
                <div class="modal-background" data-widget="trigger" data-event="click" data-action="remove"></div>

                <div class="markdown-editor" data-widget="markdown-editor" data-autosubmit="true">
                    <div class="markdown-editor-text-pane">
                        <textarea name="value">${value}</textarea>
                    </div>
                    <div class="markdown-editor-preview-pane content" data-widget="frame" data-url="&_part=markdown-editor-preview"></div>
                </div>
                <button class="modal-close is-large" aria-label="close" data-widget="trigger" data-event="click" data-action="remove"></button>
            </div>
        `;
    },

    renderMarkdownEditorPreview(){
        const { renderMarkdown, params: { value = '' } } = this;
        return renderMarkdown(value);
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
        out.label = optionsField.label || formAdapterField.label || capitalize(out.name);
        out.type = optionsField.type || formAdapterField.type || 'text';
        out.value = formAdapterField.value;
        return out;
    });
};

const createObjectFormAdapter = object => {
    const title = object.title || 'Submit';
    const fields = normalizeFields(object.fields) || [];
    const submitTitle = object.submitTitle || title;
    const cancelTitle = object.cancelTitle || 'Cancel';
    const success = object.success || (() => {});
    const model = Base.extend().include({
        meta(){
            this.include(Validatable);
            this.include(object.model || {});
        }
    }).new();

    return {
        title, fields, submitTitle, cancelTitle,
        
        async submit(values, _success){
            Object.assign(model, values);
            await model.validate();
            return _success(model) || success(model);
        }
    }
};
