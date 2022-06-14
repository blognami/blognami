
import { ValidationError } from '../validation_error.js';
import { capitalize } from '../inflector.js';

export default {
    create(){
        return (...args) => this.render(...args);
    },

    async render(formAdaptable, options = {}){
        const { params, renderHtml } = this;

        const formAdapter = await formAdaptable.toFormAdapter();
        
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
            <div class="modal" data-node-wrapper="anchor" data-action="remove" data-ignore-events-from-children="true">
                <button data-node-wrapper="anchor" data-action="remove"></button>
                <form
                    class="card"
                    method="post"
                    enctype="multipart/form-data"
                    autocomplete="off"
                    ${unsavedChangesConfirm ? renderHtml`data-unsaved-changes-confirm="${unsavedChangesConfirm}"` : undefined}
                    ${unsavedChangesConfirm && params._method == 'POST' ? renderHtml`data-has-unsaved-changes="true"` : undefined}
                >
                        <div class="card-header">
                            <p class="card-header-title">${title}</p>
                        </div>
                        <div class="card-body">
                            ${() => {
                                if(otherErrors.length){
                                    return renderHtml`
                                        <div class="field">
                                            ${otherErrors.map(error => renderHtml`
                                                <p class="is-error">${error}</p>
                                            `)}
                                        </div>
                                    `
                                }
                            }}
                            ${fields.map(({ label, name, type, value, nodeWrapper, placeholder, error }) => {
                                if(type == 'hidden'){
                                    return renderHtml`
                                        <input type="hidden" name="${name}" value="${value}">
                                    `;
                                }
                                return renderHtml`
                                    <div>
                                        <label class="label">${label}</label>
                                        ${() => {
                                            if(type == 'textarea'){
                                                return renderHtml`
                                                    <textarea class="textarea${error ? ' is-error' : ''}" name="${name}"${nodeWrapper ? renderHtml` data-node-wrapper="${nodeWrapper}"` : undefined}${placeholder ? renderHtml` placeholder="${placeholder}"` : undefined}>${value}</textarea>
                                                `;
                                            }
                                            if(type == 'checkbox'){
                                                return renderHtml`
                                                    <input class="input${error ? ' is-error' : ''}" type="checkbox" name="${name}" type="${type}" ${value ? 'checked' : ''}${nodeWrapper ? renderHtml` data-node-wrapper="${nodeWrapper}"` : undefined}>
                                                `;
                                            }
                                            return renderHtml`
                                                <input class="input${error ? ' is-error' : ''}" name="${name}" type="${type}" value="${value}"${nodeWrapper ? renderHtml` data-node-wrapper="${nodeWrapper}"` : undefined}${placeholder ? renderHtml` placeholder="${placeholder}"` : undefined}>
                                            `;
                                        }}
                                        ${() => {
                                            if(error){
                                                return renderHtml`
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
                            <button class="button" data-node-wrapper="anchor" data-action="remove">${cancelTitle}</button>
                        </div>
                    </div>
            </div>
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
        out.label = optionsField.label || formAdapterField.label || capitalize(out.name);
        out.type = optionsField.type || formAdapterField.type || 'text';
        out.nodeWrapper = optionsField.nodeWrapper || formAdapterField.nodeWrapper;
        out.placeholder = optionsField.placeholder || formAdapterField.placeholder;
        out.value = formAdapterField.value;
        return out;
    });
};

