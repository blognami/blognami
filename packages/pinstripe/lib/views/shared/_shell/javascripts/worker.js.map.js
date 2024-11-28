
export default {
    async render(){
        const bundle = 'worker';
        const { map } = await this.bundler.build(bundle);
        return [200, { 'content-type': 'application/json'}, [ map ]];
    }
};
