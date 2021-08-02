
import { dasherize } from 'pinstripe';

export const Pageable = ({ canBe, beforeValidation, props }) => {
    canBe('pageable');

    beforeValidation(async function(){
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

    props({
        generateCandidateSlug(n){
            const out = dasherize(`${this.title || 'page'}`);
            if(n > 1){
                return `${out}-${n}`;
            }
            return out;
        }
    });
};
