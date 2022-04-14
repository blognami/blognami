
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
                    <span data-node-wrapper="anchor" data-target="_parent" data-trigger="click"></span>
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

        return renderHtml`
            <div class="ps-modal" data-node-wrapper="anchor" data-action="remove" data-ignore-events-from-children="true">
                <button data-node-wrapper="anchor" data-action="remove"></button>
                <form
                    class="ps-card"
                    method="post"
                    enctype="multipart/form-data"
                    autocomplete="off"
                    ${unsavedChangesConfirm ? renderHtml`data-unsaved-changes-confirm="${unsavedChangesConfirm}"` : undefined}
                    ${unsavedChangesConfirm && params._method == 'POST' ? renderHtml`data-has-unsaved-changes="true"` : undefined}
                >
                        <div class="ps-card-header">
                            <p class="ps-card-header-title">${title}</p>
                        </div>
                        <div class="ps-card-body">
                            ${() => {
                                if(otherErrors.length){
                                    return renderHtml`
                                        <div class="ps-field">
                                            ${otherErrors.map(error => renderHtml`
                                                <p class="ps-is-error">${error}</p>
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
                                    <div>
                                        <label class="ps-label">${label}</label>
                                        ${() => {
                                            if(type == 'textarea'){
                                                return renderHtml`
                                                    <textarea class="ps-textarea${error ? ' ps-is-error' : ''}" name="${name}">${value}</textarea>
                                                `
                                            }
                                            if(type == 'markdown'){
                                                return renderHtml`
                                                    <textarea class="ps-textarea${error ? ' ps-is-error' : ''}" name="${name}" data-node-wrapper="anchor" data-target="_overlay" data-href="&_part=markdown-editor">${value}</textarea>
                                                `
                                            }
                                            if(type == 'checkbox'){
                                                return renderHtml`
                                                    <input class="ps-input${error ? ' ps-is-error' : ''}" type="checkbox" name="${name}" type="${type}" ${value ? 'checked' : ''} />
                                                `
                                            }
                                            return renderHtml`
                                                <input class="ps-input${error ? ' ps-is-error' : ''}" name="${name}" type="${type}" value="${value}">
                                            ` 
                                        }}
                                        ${() => {
                                            if(error){
                                                return renderHtml`
                                                    <p class="ps-is-error">${error}</p>
                                                `
                                            }
                                        }}
                                    </div>
                                `;
                            })}
                        </div>
                        <div class="ps-card-footer">
                            <button class="ps-button" type="submit">${submitTitle}</button>
                            <button class="ps-button" data-node-wrapper="anchor" data-action="remove">${cancelTitle}</button>
                        </div>
                    </div>
            </div>
        `;
    },

    async renderMarkdownEditor(){
        const { renderHtml, params } = this;
        const { value = '' } = params;

        return renderHtml`
            <div class="ps-modal" data-node-wrapper="anchor" data-action="remove" data-ignore-events-from-children="true">
                <button data-node-wrapper="anchor" data-action="remove"></button>
                <div class="ps-markdown-editor" data-autosubmit="true" data-node-wrapper="markdown-editor">
                    <div class="ps-markdown-editor-text-pane">
                        <textarea name="value">${value}</textarea>
                    </div>
                    <div class="ps-markdown-editor-preview-pane" data-url="&_part=markdown-editor-preview" data-node-wrapper="frame"></div>
                </div>
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
