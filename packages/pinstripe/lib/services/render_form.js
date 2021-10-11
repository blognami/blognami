
import { defineService } from 'pinstripe';
import { ValidationError } from '../validation_error.js';
import { capitalize } from '../inflector.js';
import { Base } from '../base.js';
import { Validatable } from '../validatable.js';

defineService('renderForm', ({ params, renderHtml, renderScript }) => {
    return async (formAdaptable, options = {}) => {
        const formAdapter = await (typeof formAdaptable.toFormAdapter == 'function' ? formAdaptable.toFormAdapter() : createObjectFormAdapter(formAdaptable));
        
        const values = {};
        normalizeFields(options.fields || formAdapter.fields).forEach(({ name }) => {
            values[name] = params[name];
        });

        const errors = {};
        if(params._method == 'POST'){
            try {
                return await formAdapter.submit(values) || renderScript(() => this.frame.frame.load());
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
                <div class="modal-background"></div>
                <div class="modal-card">
                    <form method="post" enctype="multipart/form-data" autocomplete="off">
                        <header class="modal-card-head">
                            <p class="modal-card-title">${title}</p>
                            <button type="button" class="delete" aria-label="close"></button>
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
                            <button class="button">${cancelTitle}</button>
                        </footer>
                    </form>
                </div>
                ${renderScript(function(){
                    this.parent.on('click', '.modal-background, .modal-close, .delete, .modal-card-foot > button:not(.is-success)', () => {
                        this.frame.frame.load();
                    });
                })}
            </div>
        `;
    }
});

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
        title, fields, submitTitle, cancelTitle, success,
        
        async submit(values){
            Object.assign(model, values);
            await model.validate();
            return this.success(model);
        }
    }
};
