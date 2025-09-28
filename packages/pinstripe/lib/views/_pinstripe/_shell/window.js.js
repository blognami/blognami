
export default {
    async render(){
        const { js } = await this.bundler.build('window');
        return [200, { 'content-type': 'text/javascript' }, [ `${js}\n//# sourceMappingURL=/_pinstripe/_shell/window.js.map` ]];
    }
};
