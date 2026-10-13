
export default {
    meta(){
        this.addHook('render', function({ section } = {}){
            return this.renderView('_navbar', { section });
        })
    },

    render(){
        const { section } = this.params;

        return this.runHook('render', { args: [{ section }] });
    }
}