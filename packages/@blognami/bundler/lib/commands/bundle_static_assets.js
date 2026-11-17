
const OUTPUT_DIR = 'build/static-assets';
const BASE_URL = 'http://127.0.0.1/';

const ASSETS = [
    ['_blognami/_shell/window.js', '/_blognami/_shell/window.js'],
    ['_blognami/_shell/window.js.map', '/_blognami/_shell/window.js.map'],
    ['_blognami/_shell/service_worker.js.map', '/_blognami/_shell/service_worker.js.map'],
    ['_blognami/_shell/styles.css', '/_blognami/_shell/styles.css'],
    ['service_worker.js', '/service_worker.js']
];

export default {
    meta(){
        this.annotate({
            description: 'Bundles the shell\'s static assets (window.js, styles.css, service_worker.js and their source maps) in the build/static-assets directory.'
        });
    },

    async run(){
        // Force on-the-fly rendering, so a rebuild never copies the stale prebuilt files it is replacing.
        this.serviceManager.intercept('prebuiltAssets', () => ({ read: () => undefined }));

        const { inProjectRootDir, generateDir, writeFile } = this.fsBuilder;

        await inProjectRootDir(async () => {
            await generateDir(OUTPUT_DIR, async () => {
                for(const [viewName, pathname] of ASSETS){
                    // renderView rather than callHandler.handleCall, so guard views (and the database) are never reached
                    const [ , , body ] = this.callHandler.normalizeResponse(await this.renderView(viewName, { _url: new URL(pathname, BASE_URL) }));
                    // writeFile rather than generateFile, which renders through Text and reads the existing file
                    await writeFile(pathname.replace(/^\//, ''), body.join(''));
                }
            });
        });
    }
};
