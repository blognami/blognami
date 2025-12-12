
export default {
    meta(){
        this.addHook('render', function(){
            return this.renderView('_navbar');
        })
    },

    render(){
        return this.runHook('render');
    }
}