
export default {
    async render(){
        try {
            await this.runHook('check');
        } catch(e){
            return [503, { 'Content-Type': 'text/plain' }, ['Service Unavailable']];
        }
        return [200, { 'Content-Type': 'text/plain' }, ['OK']];
    }
};
