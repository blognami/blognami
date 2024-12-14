
export default {
    async render(){
        return [200, { 'content-type': 'application/json' }, [ JSON.stringify( await this.theme ) ]];
    }
}