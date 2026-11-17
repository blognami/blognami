import test, { after } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { appendFileSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const cli = fileURLToPath(new URL('../../../blognami/cli.js', import.meta.url));
const fixture = fileURLToPath(new URL('../test/project', import.meta.url));
const scriptPath = join(fixture, 'build/cloudflare-worker/index.js');
const configPath = join(fixture, 'wrangler.toml');
const assetsPath = join(fixture, 'build/cloudflare-worker-assets');
const staticAssetsPath = join(fixture, 'build/static-assets');
// The fixture's one file-backed view, stored under its full view name.
const FILE_BACKED_VIEW_NAME = '--beta/images/pixel.png';
const HAND_PLACED_FILE = 'placed-by-hand.txt';
const SHELL_ASSET_COUNT = 5;
const VIEWS_PATH = 'lib/views';
// The CSS build warns on stderr once its browsers data is old, and a failed build is told by stderr.
const BUNDLE_ENV = { ...process.env, BROWSERSLIST_IGNORE_OLD_DATA: 'true' };

const filesIn = dirPath => readdirSync(dirPath, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => relative(dirPath, join(entry.parentPath, entry.name)))
    .sort();

const bundle = () => spawnSync(process.execPath, [cli, 'bundle-cloudflare-worker'], { cwd: fixture, encoding: 'utf8', env: BUNDLE_ENV });

after(() => {
    rmSync(join(fixture, 'build'), { recursive: true, force: true });
    rmSync(configPath, { force: true });
    rmSync(join(fixture, '.wrangler'), { recursive: true, force: true });
});

test('bundle-cloudflare-worker builds the Cloudflare Worker script, fills the assets directory from empty and writes wrangler.toml when the project has none', async () => {
    const first = bundle();
    // The CLI exits 0 on a thrown error too, so a failed build shows on stderr.
    assert.equal(first.status, 0, first.stderr);
    assert.equal(first.stderr, '');

    const script = await import(pathToFileURL(scriptPath));
    assert.equal(typeof script.default.fetch, 'function');
    assert.equal(typeof script.BlognamiDurableObject, 'function');

    const config = readFileSync(configPath, 'utf8');
    assert.match(config, /^name = "cloudflare-fixture"$/m);
    assert.match(config, /^main = "build\/cloudflare-worker\/index\.js"$/m);
    assert.match(config, /^compatibility_flags = \["nodejs_compat"\]$/m);
    assert.match(config, /^class_name = "BlognamiDurableObject"$/m);
    assert.match(config, /^new_sqlite_classes = \["BlognamiDurableObject"\]$/m);
    assert.equal(config.includes('DATABASE'), false);
    assert.match(config, /^directory = "build\/cloudflare-worker-assets"$/m);
    assert.match(config, /^binding = "ASSETS"$/m);
    assert.match(config, /^run_worker_first = true$/m);
    assert.match(config, /^html_handling = "none"$/m);
    assert.match(config, /^\[\[r2_buckets\]\]\nbinding = "R2_BUCKET"\nbucket_name = "cloudflare-fixture"$/m);
    assert.ok(config.endsWith('bucket_name = "cloudflare-fixture"\n\n[[send_email]]\nname = "EMAIL"\n'), config);

    const shellAssets = filesIn(staticAssetsPath);
    assert.equal(shellAssets.length, SHELL_ASSET_COUNT, `${shellAssets}`);
    const assets = [...shellAssets, FILE_BACKED_VIEW_NAME].sort();
    assert.deepEqual(filesIn(assetsPath), assets);
    assert.ok(readFileSync(join(assetsPath, FILE_BACKED_VIEW_NAME)).equals(readFileSync(join(fixture, VIEWS_PATH, FILE_BACKED_VIEW_NAME))));

    writeFileSync(join(assetsPath, HAND_PLACED_FILE), 'placed by hand');

    appendFileSync(configPath, '# edited by hand\n');
    const edited = readFileSync(configPath, 'utf8');

    const second = bundle();
    assert.equal(second.status, 0, second.stderr);
    assert.equal(second.stderr, '');
    assert.equal(readFileSync(configPath, 'utf8'), edited);
    assert.deepEqual(filesIn(assetsPath), assets);
});
