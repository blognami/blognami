
const PATHNAME = '/service_worker.js';

export default {
    async render(){
        // blognami-if(server,service-worker): return this.prebuiltAssets.handOver(PATHNAME, 'text/javascript'); // the Cloudflare Worker answers with the stored file
        const body = await this.prebuiltAssets.read(PATHNAME) ?? await this.buildJs();
        return [200, { 'content-type': 'text/javascript' }, [ body ]];
    },

    async buildJs(){
        const { js } = await this.jsBundler.build('clientServiceWorker');
        return `${js}\n//# sourceMappingURL=/_blognami/_shell/service_worker.js.map`;
    }
};
