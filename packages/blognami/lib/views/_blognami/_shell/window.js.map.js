
const PATHNAME = '/_blognami/_shell/window.js.map';

export default {
    async render(){
        // blognami-if(server,service-worker): return this.prebuiltAssets.handOver(PATHNAME, 'application/json'); // the Cloudflare Worker answers with the stored file
        const body = await this.prebuiltAssets.read(PATHNAME) ?? await this.buildMap();
        return [200, { 'content-type': 'application/json'}, [ body ]];
    },

    async buildMap(){
        const { map } = await this.jsBundler.build('window');
        return map;
    }
};
