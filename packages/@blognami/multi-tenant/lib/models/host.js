
export default {
    meta(){
        this.include('untenantable');
        this.belongsTo('tenant');
    }
};
