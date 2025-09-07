
import { inflector } from '@pinstripe/utils';

export default {
    meta(){
        this.on('before:validation', async function(){
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

        this.on('validation', async pageable => {
            if(!pageable.isValidationError('slug') && await pageable.database.pageables.where({ idNe: pageable.id, slug: pageable.slug }).count()){
                pageable.setValidationError('slug', 'Must be unique');
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
