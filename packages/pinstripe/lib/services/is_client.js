
export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        return false; // pinstripe-if-client: return true;
    }
};