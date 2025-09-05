
export default {
    async render(){
        const bundle = 'serviceWorker';
        const { js } = await this.bundler.build(bundle);
        return [200, { 'content-type': 'text/javascript', 'service-worker-allowed': '/' }, [ `${js}\n//# sourceMappingURL=${bundle}.js.map` ]];
    }
};
