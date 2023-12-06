
export default {
    create(){
        return async (name, params = {}) => {
            const out = await this.app.renderView(name != '' ? `${name}/index`: 'index', params);
            if(out){
                return out;
            }
            return this.app.renderView(name, params);
        }
    }
};
