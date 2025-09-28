
export default {
    async render(){
        const { map } = await this.bundler.build('serviceWorker');
        return [200, { 'content-type': 'application/json'}, [ map ]];
    }
};
