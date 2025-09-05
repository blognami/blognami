
import { Theme } from '../theme.js'

export default {
    async create(){
        if(!this.context.root.theme){
            this.context.root.theme = Theme.new().deepMerge(await this.config.theme || {});
        }
        return this.context.root.theme;
    }
};
