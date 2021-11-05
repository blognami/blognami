
export default {
    meta(){
        this.parent.prototype.assignProps({
            isInput: false
        });
    },

    isInput: true,

    get name(){
        return this.attributes.name;
    },
    
    get value(){
        if(this.is('input[type="file"]')){
            return this.node.files[0];
        }
        if(this.is('input[type="checkbox"], input[type="radio"]')){
            return this.is(':checked') ? this.node.value : undefined;
        }
        return this.node.value;
    }
};
