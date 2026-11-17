const PATHNAME = '/_blognami/_shell/styles.css';

export default {
    async render(){
        // blognami-if(server,service-worker): return this.prebuiltAssets.handOver(PATHNAME, 'text/css'); // the Cloudflare Worker answers with the stored file
        const body = await this.prebuiltAssets.read(PATHNAME) ?? await this.buildCss();
        return [200, { 'content-type': 'text/css'}, [ body ]];
    },

    buildCss(){
        return this.cssBundler.build();
    }
};
