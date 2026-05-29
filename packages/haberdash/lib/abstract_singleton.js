
export const AbstractSingleton = {
    meta(){
        this.assignProps({
            get instance(){
                if(!this.hasOwnProperty('_instance')){
                    this._instance = this.new();
                }
                return this._instance;
            }
        })
    }
};
