
let theme;

export const client = {
    create(){
        if(!theme){
            theme = (async () => fetch('/_services/theme').then(response => response.json()))();
        }
        return theme;
    }
};

export default {
    create(){
        if(!this.context.root.theme){
            this.context.root.theme = (async () => {
                const site = await this.database.site;
                return site?.theme || 'default';
            })();
        }
        return this.context.root.theme;
    }
};