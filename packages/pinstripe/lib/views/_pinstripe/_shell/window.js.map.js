
export default {
    async render(){
        const { map } = await this.bundler.build('window');
        return [200, { 'content-type': 'application/json'}, [ map ]];
    }
};
