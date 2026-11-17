
const PATHNAME = '/_blognami/_shell/window.js';

export default {
    async render(){
        // blognami-if(server,service-worker): return this.prebuiltAssets.handOver(PATHNAME, 'text/javascript'); // the Cloudflare Worker answers with the stored file
        const body = await this.prebuiltAssets.read(PATHNAME) ?? await this.buildJs();
        return [200, { 'content-type': 'text/javascript' }, [ body ]];
    },

    async buildJs(){
        const { js } = await this.jsBundler.build('window');
        return `${js}\n//# sourceMappingURL=/_blognami/_shell/window.js.map`;
    }
};
