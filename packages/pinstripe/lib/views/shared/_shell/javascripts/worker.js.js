
export default {
    async render(){
        const bundle = 'worker';
        const { js } = await this.bundler.build(bundle);
        return [200, { 'content-type': 'text/javascript' }, [ `${js}\n//# sourceMappingURL=${bundle}.js.map` ]];
    }
};
