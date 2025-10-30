import { inflector } from '@pinstripe/utils';

export default {
    meta(){
        this.addHook('beforeValidation', async function(){
            const slug = `${this.slug || ''}`.trim();
            if(slug == ''){
                let n = 1;
                while(true){
                    const candidateSlug = this.generateCandidateSlug(n);
                    if(!(await this.database.pageables.where({ slug: candidateSlug }).first())){
                        this.slug = candidateSlug;
                        break;
                    }
                    n++;
                }
            }
        });

        this.addHook('validation', async function(){
            if(!this.isValidationError('slug') && await this.database.pageables.where({ idNe: this.id, slug: this.slug }).count()){
                this.setValidationError('slug', 'Must be unique');
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