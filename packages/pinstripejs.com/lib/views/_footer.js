
export default {
    meta(){
        this.addHook('beforeRender', function(){
            this.copyrightOwner = 'Blognami Ltd';
        });
    }
}