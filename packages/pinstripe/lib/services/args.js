
export default {
    create(){
        if(!this.context.hasOwnProperty('args')){
            this.context.args = [];
        }
        return this.context.args;
    }
};
