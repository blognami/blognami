
export default {
    async render(){
        const { bundle = 'window' } = this.params;
        const { js } = await this.bundler.build(bundle);
        return [200, { 'content-type': 'text/javascript'}, [ `${js}\n//# sourceMappingURL=all.js.map?bundle=${bundle}` ]];
    }
};
