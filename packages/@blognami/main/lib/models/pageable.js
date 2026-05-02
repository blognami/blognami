import { inflector } from '@pinstripe/utils';

export default {
    meta(){
        this.addHook('beforeValidation', async function(){
            const slug = `${this.slug || ''}`.trim();
            if(slug == ''){
                const viewMap = await this.workspace.viewMap;
                let n = 1;
                while(true){
                    const candidateSlug = this.generateCandidateSlug(n);
                    const isReservedByViewMap = Object.prototype.hasOwnProperty.call(viewMap, candidateSlug);
                    const existingPageableWithSlug = this.database.pageables.where({ slug: candidateSlug }).first();
                    if(!isReservedByViewMap && !(await existingPageableWithSlug)){
                        this.slug = candidateSlug;
                        break;
                    }
                    n++;
                }
            }
        });

        this.addHook('validation', async function(){
            const otherPageableWithSlugCount = this.database.pageables.where({ idNe: this.id, slug: this.slug }).count();
            if(!this.isValidationError('slug') && await otherPageableWithSlugCount){
                this.setValidationError('slug', 'Must be unique');
            }
            const slugChanged = this.slug !== this._initialFields.slug;
            if(!this.isValidationError('slug') && slugChanged){
                const viewMap = await this.workspace.viewMap;
                const isReservedByViewMap = Object.prototype.hasOwnProperty.call(viewMap, this.slug);
                if(isReservedByViewMap){
                    this.setValidationError('slug', 'Reserved by a built-in page');
                }
            }
        });
    },

    generateCandidateSlug(n){
        const out = inflector.dasherize(this.title || this.name);
        if(n > 1){
            return `${out}-${n}`;
        }
        return out;
    }
};