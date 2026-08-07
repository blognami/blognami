
export default {
    async render(){
        const { js } = await this.bundler.build('window');
        return [200, { 'content-type': 'text/javascript' }, [ `${js}\n//# sourceMappingURL=/_blognami/_shell/window.js.map` ]];
    }
};
