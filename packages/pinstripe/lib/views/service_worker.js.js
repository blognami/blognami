
export default {
    async render(){
        const { js } = await this.bundler.build('serviceWorker');
        return [200, { 'content-type': 'text/javascript' }, [ `${js}\n//# sourceMappingURL=/_pinstripe/_shell/service_worker.js.map` ]];
    }
};
