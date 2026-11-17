
const SCRIPT_PATH = 'build/cloudflare-worker/index.js';
const CONFIG_PATH = 'wrangler.toml';
const OBJECT_CLASS = 'BlognamiDurableObject';
const OBJECT_BINDING = 'BLOGNAMI';
const COMPATIBILITY_DATE = '2026-11-01';
const MIGRATION_TAG = 'v1';
const ASSETS_PATH = 'build/cloudflare-worker-assets';
const ASSETS_BINDING = 'ASSETS';
const ASSETS_RUN_WORKER_FIRST = true;
const ASSETS_HTML_HANDLING = 'none';
const R2_BINDING = 'R2_BUCKET';
const EMAIL_BINDING = 'EMAIL';
const STATIC_ASSETS_COMMAND = 'bundle-static-assets';
// Where that command writes the shell assets.
const STATIC_ASSETS_PATH = 'build/static-assets';

export default {
    meta(){
        this.annotate({
            description: 'Bundles the server service worker as a Cloudflare Worker script in the build/cloudflare-worker directory, and writes a wrangler.toml when the project has none.'
        });
    },

    async run(){
        await this.cloudflareWorkerBundle.addModules(OBJECT_CLASS);

        const { name } = await this.project;

        const { js } = await this.jsBundler.build('serviceWorker');

        await this.runCommand(STATIC_ASSETS_COMMAND);

        const { inProjectRootDir, writeFile } = this.fsBuilder;
        const { checkFileExists, emptyDir, copyDir, copyFileBackedViews } = this.cloudflareWorkerBundle;

        await inProjectRootDir(async () => {
            await writeFile(SCRIPT_PATH, js);
            emptyDir(ASSETS_PATH);
            copyDir(STATIC_ASSETS_PATH, ASSETS_PATH);
            copyFileBackedViews(ASSETS_PATH);
            if(!checkFileExists(CONFIG_PATH)) await writeFile(CONFIG_PATH, this.renderConfig(name));
        });
    },

    renderConfig(name){
        return [
            `name = ${JSON.stringify(name)}`,
            `main = ${JSON.stringify(SCRIPT_PATH)}`,
            `compatibility_date = ${JSON.stringify(COMPATIBILITY_DATE)}`,
            'compatibility_flags = ["nodejs_compat"]',
            '',
            '[[durable_objects.bindings]]',
            `name = ${JSON.stringify(OBJECT_BINDING)}`,
            `class_name = ${JSON.stringify(OBJECT_CLASS)}`,
            '',
            '[[migrations]]',
            `tag = ${JSON.stringify(MIGRATION_TAG)}`,
            `new_sqlite_classes = [${JSON.stringify(OBJECT_CLASS)}]`,
            '',
            '[assets]',
            `directory = ${JSON.stringify(ASSETS_PATH)}`,
            `binding = ${JSON.stringify(ASSETS_BINDING)}`,
            `run_worker_first = ${JSON.stringify(ASSETS_RUN_WORKER_FIRST)}`,
            `html_handling = ${JSON.stringify(ASSETS_HTML_HANDLING)}`,
            '',
            '[[r2_buckets]]',
            `binding = ${JSON.stringify(R2_BINDING)}`,
            `bucket_name = ${JSON.stringify(name)}`,
            '',
            '[[send_email]]',
            `name = ${JSON.stringify(EMAIL_BINDING)}`,
            ''
        ].join('\n');
    }
};
