
export default {
    meta(){
        this.addHook('beforeRender', function(){
            this.title = 'Blognami';
        });
    }
}