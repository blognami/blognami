
let theme;

export const client = {
    async create(){
        if(!theme){
            theme = await fetch('/_shell/theme.json').then(response => response.json())
        }
        return theme;
    }
};

export default {
    async create(){
        if(!this.context.root.theme){
            this.context.root.theme = await this.config.theme || 'default'
        }
        return this.context.root.theme;
    }
};