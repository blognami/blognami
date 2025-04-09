
export default {
    async render(){
        const bundle = 'window';
        const { map } = await this.bundler.build(bundle);
        return [200, { 'content-type': 'application/json'}, [ map ]];
    }
};
