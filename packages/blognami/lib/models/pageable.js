
import { dasherize } from 'pinstripe';

export default {
    abstract: true,

    meta(){
        this.canBe('pageable');

        this.beforeValidation(async function(){
            const slug = `${this.slug || ''}`.trim();
            if(slug == ''){
                let n = 1;
                while(true){
                    const candidateSlug = this.generateCandidateSlug(n);
                    if(!(await this._database.pageables.slugEq(candidateSlug).first())){
                        this.slug = candidateSlug;
                        break;
                    }
                    n++;
                }
            }
        });
    },

    generateCandidateSlug(n){
        const out = dasherize(this.title);
        if(n > 1){
            return `${out}-${n}`;
        }
        return out;
    }
};
