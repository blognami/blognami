
export default {
    async render(){
        const { js } = await this.clientBuilder.build();
        return [200, { 'content-type': 'text/javascript'}, [ `${js}\n//# sourceMappingURL=all.js.map` ]];
    }
};
