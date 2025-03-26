
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
        for(let { name, type, value } of normalizeFields(options.fields || formAdapter.fields)){
            if(type == 'forced'){
                values[name] = await value;
            } else {
                values[name] = this.params[name];
            }
        }
        
        const requiresProofOfWork = (options.requiresProofOfWork || formAdapter.requiresProofOfWork || false) && process.env.NODE_ENV != 'test';
        const { validateWith, success } = options;

        const errors = {};
        if(this.params._method == 'POST'){
            try {
                if(this.params._bodyErrors) throw new ValidationError(this.params._bodyErrors);

                if(requiresProofOfWork){
                    if(!this.params._proofOfWork) throw new ValidationError({ _proofOfWork: 'Must not be blank' });
                    if(!await verifyProofOfWork(values, this.params._proofOfWork)) throw new ValidationError({ _proofOfWork: 'Must be a valid' });
                    if(await this.oneTimeToken.hasBeenUsed({ proofOfWork: this.params._proofOfWork })) throw new ValidationError({ _proofOfWork: 'Must be unused' });
                }

                const out = await formAdapter.submit(values, { validateWith, success }) || this.renderHtml`
                    <span data-component="pinstripe-anchor" data-target="_parent">
                        <script type="pinstripe">this.parent.trigger('click');</script>
                    </span>
                `;
                if(requiresProofOfWork) await this.oneTimeToken.markAsUsed({ proofOfWork: this.params._proofOfWork });
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
        const _class = options.class || formAdapter.class;
        const width = options.width || formAdapter.width;
        const height = options.height || formAdapter.height;

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
                field.value = field.filter(value);
            }
        });

        return this.renderView('_blognami/_form', {
            requiresProofOfWork,
            isPlaceholder: this.params._placeholder == 'true',
            method: this.params._method,
            title,
            otherErrors,
            fields,
            submitTitle,
            cancelTitle,
            unsavedChangesConfirm,
            class: _class,
            width,
            height
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

const FIELD_FILTERS = {
    checkbox: value => `${value}` == 'true',
    number: value => parseFloat(`${value}`),
    date: value => value != undefined ? new Date(value) : value,
    'datetime-local': value => value != undefined ? new Date(value) : value,
    default: value => value,
};

const extractFields = (formAdapter, options) => {
    const normalizedFormAdapterFields = normalizeFields(formAdapter.fields);
    const normalizedOptionsFields = options.fields ? normalizeFields(options.fields) : normalizedFormAdapterFields;
    const indexedNormalizedFormAdapterFields = indexFieldsByName(normalizedFormAdapterFields);
    return normalizedOptionsFields.map(optionsField => {
        const out = { ...optionsField };
        const formAdapterField = indexedNormalizedFormAdapterFields[optionsField.name] || {};
        out.name = optionsField.name;
        out.label = optionsField.label || formAdapterField.label || Inflector.instance.humanize(out.name);
        out.type = optionsField.type || formAdapterField.type || 'text';
        out.component = optionsField.component || formAdapterField.component;
        out.placeholder = optionsField.placeholder || formAdapterField.placeholder;
        out.filter = FIELD_FILTERS[out.type] || FIELD_FILTERS.default;
        out.value = out.filter(optionsField.value || formAdapterField.value);
        out.overlayLinks = optionsField.overlayLinks || formAdapterField.overlayLinks || [];
        out.watch = optionsField.watch || false;
        return out;
    }).filter(field => field.type != 'forced');
};

