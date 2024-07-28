
export default {
    async render(){
        const { js } = await this.bundler.build();
        return [200, { 'content-type': 'text/javascript'}, [ `${js}\n//# sourceMappingURL=all.js.map` ]];
    }
};
