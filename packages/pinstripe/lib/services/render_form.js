
import { ValidationError } from '../validation_error.js';
import { Inflector } from '../inflector.js';
import { verifyProofOfWork } from '../proof_of_work.js';

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
        
        const requiresProofOfWork = (options.requiresProofOfWork || formAdapter.requiresProofOfWork || false) && process.env.NODE_ENV != 'test';
        const success = options.success || (() => {});

        const errors = {};
        if(this.params._method == 'POST'){
            try {
                if(requiresProofOfWork){
                    if(!this.params._proofOfWork) throw new ValidationError({ _proofOfWork: 'Must not be blank' });
                    if(!await verifyProofOfWork(values, this.params._proofOfWork)) throw new ValidationError({ _proofOfWork: 'Must be a valid' });
                    if(await this.onlyOnce.hasBeenUsed({ proofOfWork: this.params._proofOfWork })) throw new ValidationError({ _proofOfWork: 'Must be unused' });
                }
                const out = await formAdapter.submit(values, success) || this.renderHtml`
                    <span data-component="pinstripe-anchor" data-target="_parent">
                        <script type="pinstripe">this.parent.trigger('click');</script>
                    </span>
                `;
                if(requiresProofOfWork) await this.onlyOnce.markAsUsed({ proofOfWork: this.params._proofOfWork });
                return out;
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

        return this.renderView('_form', {
            unsavedChangesConfirm,
            requiresProofOfWork,
            isPlaceholder: this.params._placeholder == 'true',
            method: this.params._method,
            title,
            otherErrors,
            fields,
            submitTitle,
            cancelTitle
        });
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

