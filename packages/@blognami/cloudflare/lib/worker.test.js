import test, { before, after } from 'node:test';
import assert from 'node:assert';
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:net';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import fixtureConfig from '../test/project/blognami.config.js';
import { generateProofOfWork } from '../../window/lib/proof_of_work.js';

const READY_TIMEOUT_MS = 60000;
const READY_POLL_MS = 250;
const KILL_GRACE_MS = 5000;
const STORAGE = { isStorage: true, rows: [{ one: 1 }] };
const STATIC_ASSET_HEADER = 'x-blognami-static-asset';
const UNFORWARDED_HEADERS = [STATIC_ASSET_HEADER, 'etag', 'cache-control'];
// The fixture's file-backed view under the file path feature flag `beta`; its bytes are not valid UTF-8.
const FLAGGED_VIEW_NAME = '--beta/images/pixel.png';
const FLAGGED_VIEW_PATH = 'images/pixel.png';
const FLAGGED_VIEW_CONTENT_TYPE = 'image/png';
const FLAG_HEADERS = { 'x-feature-flags': 'beta' };
const MISSING_STORED_PATH = 'proof/missing.txt';
const STATIC_ASSETS_PATH = 'build/static-assets';
const VIEWS_PATH = 'lib/views';
const SHELL_ASSETS = [
    ['_blognami/_shell/styles.css', 'text/css'],
    ['_blognami/_shell/window.js', 'text/javascript'],
    ['_blognami/_shell/window.js.map', 'application/json'],
    ['_blognami/_shell/service_worker.js.map', 'application/json']
];
const SERVICE_WORKER_PATH = 'service_worker.js';
const SEEDED_POST_PATH = 'seeded-post';
const SESSION_COOKIE_NAME = 'blognamiSession';
const EDIT_POST_META_PATH = '/_actions/admin/edit_post_meta';
const SIGN_IN_PATH = '/_actions/guest/sign_in';
const FEATURED_IMAGE_PATTERN = /<img[^>]*data-test-id="post-featured-image"[^>]*>/g;
const UPLOAD_CONTENT_TYPE = 'image/png';
const UPLOAD_FILENAME = 'featured.png';
const REPLACEMENT_FILENAME = 'replacement.png';
// Appended to the flagged view's bytes, so the replacement differs from the first upload and is still not valid UTF-8.
const REPLACEMENT_TRAILING_BYTES = [0xff, 0xfe, 0x00];
const OVERSIZE_BYTE = 0xff;
const TIFF_CONTENT_TYPE = 'image/tiff';
const TIFF_FILENAME = 'featured.tiff';
const SAVED_META_TITLE = 'Meta title saved with no file chosen';
const { fileSize: FILE_SIZE_LIMIT } = fixtureConfig.server.limits;
// The admin the fixture's seed-database command inserts.
const ADMIN_EMAIL = 'admin@example.com';
const { from: MAIL_FROM } = fixtureConfig.mail.defaults;
const MAIL_SUBJECT = 'Your one-time-password';
// What `wrangler dev` logs ahead of each message the simulated `send_email` binding takes.
const MAIL_BLOCK_MARKER = 'send_email binding called';
const MAIL_TIMEOUT_MS = 10000;
// The recipient of the fixture's view that sends with a blank `from`; no other case sends to it.
const MISSING_SENDER_RECIPIENT = 'missing-sender@example.com';
// The config setting the adapter's error names for a message with no sender.
const MAIL_FROM_SETTING = 'mail.defaults.from';
// The one-time password as the sign-in form's message shows it: four characters, a dash, then the rest.
const DISPLAY_PASSWORD_PATTERN = /^ {4}[0-9A-Z]{4}-[0-9A-Z]+$/m;
const ALARM_TIMEOUT_MS = 10000;
// The interval of the engine's `*/5 * * * *` schedules.
const SCHEDULE_INTERVAL_MS = 5 * 60 * 1000;
// The rows the fixture's `job_rows` view writes.
const OLD_SESSION_PASS_STRING = 'old-session';
const EXPIRED_USED_HASH = 'expired-used-hash';
const UNEXPIRED_USED_HASH = 'unexpired-used-hash';
const NOTIFIED_EMAIL = 'notified@example.com';
const NOTIFICATION_BODY = 'Notification body the alarm delivers.';
const NOTIFICATION_SUBJECT_PATTERN = /: 1 new notification$/;
// The rows the fixture's `subscriber_rows` view writes.
const SUBSCRIBER_EMAIL = 'subscriber@example.com';
const UNSUBSCRIBED_EMAIL = 'unsubscribed@example.com';
const PUBLISH_POST_PATH = '/_actions/admin/publish_post';
const SEEDED_POST_TITLE = 'Seeded post title';
// What the fixture's `throw_error` job throws.
const JOB_ERROR_MESSAGE = 'The fixture job threw.';
const KEY_VALUE_KEY = 'proof';
const KEY_VALUE = { kept: true };
// The CSS build warns on stderr once its browsers data is old, and a failed build is told by stderr.
const BUNDLE_ENV = { ...process.env, BROWSERSLIST_IGNORE_OLD_DATA: 'true' };

const require = createRequire(import.meta.url);
const cli = fileURLToPath(new URL('../../../blognami/cli.js', import.meta.url));
const fixture = fileURLToPath(new URL('../test/project', import.meta.url));

let wrangler;
let origin;
let stateDir;
let output = '';

const freePort = () => new Promise((resolve, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
        const { port } = server.address();
        server.close(() => resolve(port));
    });
});

// `stateDir` is made outside, because a restart must find the same persisted state.
const startWrangler = async () => {
    const port = await freePort();
    const inspectorPort = await freePort();
    origin = `http://127.0.0.1:${port}`;

    // Not `npx`, which runs a workspace's bin from the package root, away from the fixture.
    wrangler = spawn(process.execPath, [
        join(dirname(require.resolve('wrangler/package.json')), 'bin', 'wrangler.js'), 'dev',
        '--ip', '127.0.0.1',
        '--port', `${port}`,
        '--inspector-port', `${inspectorPort}`,
        '--persist-to', stateDir
    ], {
        cwd: fixture,
        env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true
    });
    wrangler.stdout.on('data', data => { output += data; });
    wrangler.stderr.on('data', data => { output += data; });

    const deadline = Date.now() + READY_TIMEOUT_MS;
    while(true){
        if(wrangler.exitCode !== null) throw new Error(`wrangler dev exited with ${wrangler.exitCode}:\n${output}`);
        try {
            if((await fetch(`${origin}/flags`)).ok) break;
        } catch {}
        if(Date.now() > deadline) throw new Error(`wrangler dev did not answer:\n${output}`);
        await new Promise(resolve => setTimeout(resolve, READY_POLL_MS));
    }
};

const stopWrangler = async () => {
    if(!wrangler || wrangler.exitCode !== null) return;
    const exited = new Promise(resolve => wrangler.once('exit', resolve));
    // The whole process group: `wrangler dev` runs `workerd` as a child.
    try { process.kill(-wrangler.pid, 'SIGTERM'); } catch {}
    const timer = setTimeout(() => { try { process.kill(-wrangler.pid, 'SIGKILL'); } catch {} }, KILL_GRACE_MS);
    await exited;
    clearTimeout(timer);
};

before(async () => {
    const bundle = spawnSync(process.execPath, [cli, 'bundle-cloudflare-worker'], { cwd: fixture, encoding: 'utf8', env: BUNDLE_ENV });
    // The CLI exits 0 on a thrown error too, so a failed build shows on stderr.
    assert.equal(bundle.stderr, '');

    stateDir = mkdtempSync(join(tmpdir(), 'blognami-cloudflare-worker-'));
    await startWrangler();
});

after(async () => {
    await stopWrangler();
    if(stateDir) rmSync(stateDir, { recursive: true, force: true });
    rmSync(join(fixture, 'build'), { recursive: true, force: true });
    rmSync(join(fixture, 'wrangler.toml'), { force: true });
    // `wrangler dev` keeps its build output in `.wrangler` beside the config.
    rmSync(join(fixture, '.wrangler'), { recursive: true, force: true });
});

test('the engine runs in the Durable Object as a server, not a client', async () => {
    const response = await fetch(`${origin}/flags`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { IS_SERVER: true, isClient: false });
});

test('the database service runs a query on the Durable Object\'s storage', async () => {
    const response = await fetch(`${origin}/storage`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), STORAGE);
});

test('a query param cannot shadow _cloudflare', async () => {
    const response = await fetch(`${origin}/storage?_cloudflare=sent`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), STORAGE);
});

test('a JSON body param cannot shadow _cloudflare', async () => {
    const response = await fetch(`${origin}/storage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ _cloudflare: { DATABASE: 'sent' } })
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), STORAGE);
});

test('a multipart body param cannot shadow _cloudflare', async () => {
    const body = new FormData();
    body.append('_cloudflare', 'sent');
    const response = await fetch(`${origin}/storage`, { method: 'POST', body });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), STORAGE);
});

const html = async response => {
    const body = await response.text();
    assert.equal(response.status, 200, body);
    assert.match(response.headers.get('content-type'), /^text\/html/);
    return body;
};

test('the first request creates the schema and the home page holds the seeded post', async () => {
    assert.match(await html(await fetch(`${origin}/`)), /Seeded post title/);
});

test('the seeded post\'s path answers its title and body', async () => {
    const body = await html(await fetch(`${origin}/seeded-post`));
    assert.match(body, /Seeded post title/);
    assert.match(body, /Seeded post body\./);
});

test('a path no view or post answers gets the engine\'s 404', async () => {
    const response = await fetch(`${origin}/no-such-path`);
    const body = await response.text();
    assert.equal(response.status, 404, body);
    assert.match(response.headers.get('content-type'), /^text\/html/);
});

// A followed redirect would hide /service_worker.js answering with one.
const shellAsset = async (path, contentType) => {
    const response = await fetch(`${origin}/${path}`, { redirect: 'manual' });
    const body = await response.text();
    assert.equal(response.status, 200, body);
    assert.equal(response.headers.get('content-type'), contentType);
    assert.equal(body, readFileSync(join(fixture, STATIC_ASSETS_PATH, path), 'utf8'));
    for(const name of UNFORWARDED_HEADERS){
        assert.equal(response.headers.get(name), null, name);
    }
    return response;
};

for(const [path, contentType] of SHELL_ASSETS){
    test(`/${path} answers the file the build wrote, marked noindex`, async () => {
        const response = await shellAsset(path, contentType);
        assert.equal(response.headers.get('x-robots-tag'), 'noindex');
    });
}

test('/service_worker.js answers the built file with no redirect', async () => {
    await shellAsset(SERVICE_WORKER_PATH, 'text/javascript');
});

test('the home page still answers with the seeded post once the shell assets are served', async () => {
    assert.match(await html(await fetch(`${origin}/`)), /Seeded post title/);
});

test('the jobs are registered in the Durable Object', async () => {
    const { jobs } = await (await fetch(`${origin}/registry`)).json();
    for(const name of ['purge-old-sessions', 'deliver-notifications', 'purge-used-hashes', 'email-post-to-subscribers']){
        assert.ok(jobs.includes(name), `${name} is not in ${jobs}`);
    }
});

test('the applied migrations are those list-migrations gives on Node', async () => {
    const { stdout, stderr } = spawnSync(process.execPath, [cli, 'list-migrations'], { cwd: fixture, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });
    assert.equal(stderr, '');
    const expected = [...stdout.matchAll(/^\s*\* (\d+)/gm)].map(([, schemaVersion]) => parseInt(schemaVersion)).sort((a, b) => a - b);
    assert.ok(expected.length > 0, stdout);
    const { appliedMigrations } = await (await fetch(`${origin}/registry`)).json();
    assert.deepEqual(appliedMigrations, expected);
});

const engine404 = async response => {
    const body = await response.text();
    assert.equal(response.status, 404, body);
    assert.match(response.headers.get('content-type'), /^text\/html/);
    assert.equal(response.headers.get(STATIC_ASSET_HEADER), null);
};

test('a file-backed view under a file path feature flag answers its file byte for byte with the flag on', async () => {
    const response = await fetch(`${origin}/${FLAGGED_VIEW_PATH}`, { headers: FLAG_HEADERS });
    const body = Buffer.from(await response.arrayBuffer());
    assert.equal(response.status, 200, body.toString());
    assert.equal(response.headers.get('content-type'), FLAGGED_VIEW_CONTENT_TYPE);
    assert.ok(body.equals(readFileSync(join(fixture, VIEWS_PATH, FLAGGED_VIEW_NAME))), body.toString('hex'));
    for(const name of UNFORWARDED_HEADERS){
        assert.equal(response.headers.get(name), null, name);
    }
});

test('a file-backed view under a file path feature flag answers the engine\'s 404 with the flag off', async () => {
    await engine404(await fetch(`${origin}/${FLAGGED_VIEW_PATH}`));
});

test('a file-backed view\'s own storage path answers the engine\'s 404 and not the file with the flag off', async () => {
    await engine404(await fetch(`${origin}/${FLAGGED_VIEW_NAME}`));
});

test('a view naming a stored file the binding does not hold answers a 500 naming the file', async () => {
    const response = await fetch(`${origin}/missing_stored_file`);
    assert.equal(response.status, 500);
    assert.match(await response.text(), new RegExp(MISSING_STORED_PATH));
    assert.equal(response.headers.get(STATIC_ASSET_HEADER), null);
});

test('the blobStore service in the Durable Object stores, returns and deletes bytes in the R2 bucket', async () => {
    const response = await fetch(`${origin}/blob_store`);
    const body = await response.text();
    assert.equal(response.status, 200, body);
    assert.deepEqual(JSON.parse(body), {
        isBytes: true,
        matched: true,
        inBucket: true,
        unknownIsNull: true,
        deleted: true,
        deleteOfMissingIsSilent: true
    });
});

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

const featuredImageState = async () => (await fetch(`${origin}/featured_image`)).json();

let adminSessionPromise;
// One session for every case, as each call of the fixture view inserts a row.
const adminSession = () => adminSessionPromise ||= fetch(`${origin}/admin_session`).then(response => response.json());

// With no `featured`, the part a form sends when no file is chosen.
const postMeta = async ({ featured = new File([], ''), metaTitle = '', signedIn = true } = {}) => {
    const { cookie, postId } = await adminSession();
    const body = new FormData();
    body.append('access', 'public');
    body.append('metaTitle', metaTitle);
    body.append('metaDescription', '');
    body.append('slug', SEEDED_POST_PATH);
    body.append('enableComments', 'false');
    body.append('featured', featured);
    return fetch(`${origin}${EDIT_POST_META_PATH}?id=${postId}`, {
        method: 'POST',
        headers: { accept: 'application/json', ...(signedIn ? { cookie: `${SESSION_COOKIE_NAME}=${cookie}` } : {}) },
        body
    });
};

const pngFile = (bytes, filename = UPLOAD_FILENAME, type = UPLOAD_CONTENT_TYPE) => new File([bytes], filename, { type });

const featuredImageSrc = async () => {
    const images = (await html(await fetch(`${origin}/${SEEDED_POST_PATH}`))).match(FEATURED_IMAGE_PATTERN) ?? [];
    assert.equal(images.length, 1, `${images}`);
    return images[0].match(/src="([^"]+)"/)[1];
};

const servedImage = async src => {
    const response = await fetch(`${origin}${src}`);
    const body = Buffer.from(await response.arrayBuffer());
    assert.equal(response.status, 200, body.toString());
    assert.equal(response.headers.get('content-type'), UPLOAD_CONTENT_TYPE);
    return body;
};

const uploadedBytes = readFileSync(join(fixture, VIEWS_PATH, FLAGGED_VIEW_NAME));
const replacementBytes = Buffer.concat([uploadedBytes, Buffer.from(REPLACEMENT_TRAILING_BYTES)]);

// What the upload cases leave for the cases after them, the restart case included.
let featuredSrc;
let featuredBytes;

// The error the form answers on `featured`, once the featured image and the bucket are seen unchanged.
const refusal = async featured => {
    const before = await featuredImageState();
    const response = await postMeta({ featured });
    const body = await response.text();
    assert.equal(response.status, 400, body);
    assert.deepEqual(await featuredImageState(), before);
    assert.equal(await featuredImageSrc(), featuredSrc);
    return JSON.parse(body).errors.featured;
};

test('edit_post_meta with no session is redirected to the sign-in form and the bucket gains no object', async () => {
    const { postId } = await adminSession();
    const before = await featuredImageState();
    assert.equal(before.inBucket, false);

    const response = await postMeta({ featured: pngFile(uploadedBytes), signedIn: false });
    const body = await response.text();
    assert.equal(response.status, 200, body);
    assert.match(body, /<blognami-redirect/);
    assert.ok(body.includes(`${SIGN_IN_PATH}?returnUrl=${encodeURIComponent(`${EDIT_POST_META_PATH}?id=${postId}`)}`), body);
    assert.deepEqual(await featuredImageState(), before);
});

test('a signed-in admin uploads a featured image through edit_post_meta, stored in the R2 bucket and served byte for byte', async () => {
    const before = await featuredImageState();
    const response = await postMeta({ featured: pngFile(uploadedBytes) });
    const body = await response.text();
    assert.equal(response.status, 200, body);
    assert.match(body, /<blognami-redirect/);

    featuredSrc = await featuredImageSrc();
    featuredBytes = uploadedBytes;
    const served = await servedImage(featuredSrc);
    assert.ok(served.equals(uploadedBytes), served.toString('hex'));
    assert.deepEqual(await featuredImageState(), { inBucket: true, sha256: sha256(uploadedBytes), objects: before.objects + 1 });
});

test('a featured file one byte over limits.fileSize is refused with the Node server\'s message and stores nothing', async () => {
    const error = await refusal(pngFile(Buffer.alloc(FILE_SIZE_LIMIT + 1, OVERSIZE_BYTE)));
    assert.equal(error, `file too large - limit of ${FILE_SIZE_LIMIT} bytes has been reached`);
});

test('a featured file declared image/tiff is refused with a message naming TIFF and stores nothing', async () => {
    assert.match(await refusal(pngFile(uploadedBytes, TIFF_FILENAME, TIFF_CONTENT_TYPE)), /TIFF/);
});

test('a POST with no file chosen saves the other fields and leaves the featured image as it was', async () => {
    const before = await featuredImageState();
    const response = await postMeta({ metaTitle: SAVED_META_TITLE });
    const body = await response.text();
    assert.equal(response.status, 200, body);
    assert.match(await html(await fetch(`${origin}/${SEEDED_POST_PATH}`)), new RegExp(SAVED_META_TITLE));
    assert.deepEqual(await featuredImageState(), before);
    assert.equal(await featuredImageSrc(), featuredSrc);
});

test('replacing the featured image deletes the previous image\'s object from the bucket', async () => {
    const before = await featuredImageState();
    const previousSrc = featuredSrc;
    const response = await postMeta({ featured: pngFile(replacementBytes, REPLACEMENT_FILENAME) });
    const body = await response.text();
    assert.equal(response.status, 200, body);

    featuredSrc = await featuredImageSrc();
    featuredBytes = replacementBytes;
    assert.notEqual(featuredSrc, previousSrc);
    const served = await servedImage(featuredSrc);
    assert.ok(served.equals(replacementBytes), served.toString('hex'));
    // One object in and one out: the count stands while the featured image's object is the replacement.
    assert.deepEqual(await featuredImageState(), { inBucket: true, sha256: sha256(replacementBytes), objects: before.objects });
    await engine404(await fetch(`${origin}${previousSrc}`));
});

// Each block `wrangler dev` logged for a message to `to`, as its `From:`, `Subject:`, `Text:` and `HTML:` lines.
// By `To:`, as blocks are not logged in the order sent.
const mailBlocksTo = to => output.split(MAIL_BLOCK_MARKER).slice(1)
    .map(block => Object.fromEntries([...block.matchAll(/^(From|To|Subject|Text|HTML): (.*)$/gm)].map(([, name, value]) => [name, value.trim()])))
    .filter(block => block.To == to);

test('the sign-in form\'s one-time password is sent through the EMAIL binding from mail.defaults.from', async () => {
    const values = { email: ADMIN_EMAIL, legal: 'true' };
    const body = new FormData();
    for(const [name, value] of Object.entries(values)) body.append(name, value);
    // The proof hashes the values as JSON, so they are in the form's field order.
    body.append('_proofOfWork', await generateProofOfWork(values));

    const response = await fetch(`${origin}${SIGN_IN_PATH}`, { method: 'POST', body });
    const answer = await response.text();
    assert.equal(response.status, 200, answer);
    assert.match(answer, /<blognami-redirect/);
    assert.ok(answer.includes(`${SIGN_IN_PATH}/verify_password?email=${encodeURIComponent(ADMIN_EMAIL)}`), answer);

    // The form does not await its send, and the block is logged once the send resolves.
    const deadline = Date.now() + MAIL_TIMEOUT_MS;
    while(!mailBlocksTo(ADMIN_EMAIL).some(block => block.Text)){
        if(Date.now() > deadline) throw new Error(`no message to ${ADMIN_EMAIL} was logged:\n${output}`);
        await new Promise(resolve => setTimeout(resolve, READY_POLL_MS));
    }

    const blocks = mailBlocksTo(ADMIN_EMAIL);
    assert.equal(blocks.length, 1, output);
    const [block] = blocks;
    assert.equal(block.From, MAIL_FROM);
    assert.equal(block.Subject, MAIL_SUBJECT);
    // Read now: the message files are gone once `wrangler dev` exits.
    assert.match(readFileSync(block.Text, 'utf8'), DISPLAY_PASSWORD_PATTERN);
    assert.equal(block.HTML, undefined);
});

test('a send with no sender answers a 500 naming mail.defaults.from and never reaches the EMAIL binding', async () => {
    const response = await fetch(`${origin}/missing_sender`);
    const answer = await response.text();
    assert.equal(response.status, 500, answer);
    assert.ok(answer.includes(MAIL_FROM_SETTING), answer);
    assert.equal(mailBlocksTo(MISSING_SENDER_RECIPIENT).length, 0, output);
});

const json = async path => {
    const response = await fetch(`${origin}${path}`);
    const body = await response.text();
    assert.equal(response.status, 200, body);
    return JSON.parse(body);
};

// The value under `key` in the object's key-value storage, once `value` is put there when one is given.
const keyValue = async (key, value) => {
    const params = new URLSearchParams({ key, ...(value === undefined ? {} : { value: JSON.stringify(value) }) });
    return (await json(`/key_value?${params}`)).value;
};

// First of the cases that write to the key-value storage, so the schema before it holds none of it.
test('a value put in the object\'s key-value storage is read back in a later request and leaves the schema as it was', async () => {
    const { appliedMigrations } = await json('/registry');
    const schema = await json('/schema');
    assert.ok(Object.keys(schema).length > 0);
    assert.equal(await keyValue(KEY_VALUE_KEY), null);

    assert.deepEqual(await keyValue(KEY_VALUE_KEY, KEY_VALUE), KEY_VALUE);

    assert.deepEqual(await keyValue(KEY_VALUE_KEY), KEY_VALUE);
    assert.deepEqual((await json('/registry')).appliedMigrations, appliedMigrations);
    assert.deepEqual(await json('/schema'), schema);
});

// The time the object's alarm is set for, once it is ahead: an alarm falling due is armed again by its own run.
const nextAlarm = async () => {
    const deadline = Date.now() + ALARM_TIMEOUT_MS;
    while(true){
        const { alarm } = await json('/alarm');
        const now = Date.now();
        if(alarm > now){
            assert.ok(alarm <= now + SCHEDULE_INTERVAL_MS, `${alarm} is over five minutes after ${now}`);
            assert.equal(alarm % SCHEDULE_INTERVAL_MS, 0);
            return alarm;
        }
        if(now > deadline) throw new Error(`the alarm is set for ${alarm}:\n${output}`);
        await new Promise(resolve => setTimeout(resolve, READY_POLL_MS));
    }
};

test('once the object has answered a request its alarm is set for the next whole five minutes', async () => {
    await nextAlarm();
});

test('the alarm runs the due scheduled jobs, the purges and the notification mail, and is set again', async () => {
    const { cookie } = await adminSession();
    const adminPassString = cookie.split(':')[1];
    const written = await json('/job_rows?write=true');
    assert.ok(written.sessions.includes(OLD_SESSION_PASS_STRING), `${written.sessions}`);
    assert.ok(written.usedHashes.includes(EXPIRED_USED_HASH), `${written.usedHashes}`);
    assert.equal(written.notifications, 1);

    await json('/fire_alarm');

    // Polled for the effects and never for a run, as a real alarm falling due here does the same work.
    const deadline = Date.now() + ALARM_TIMEOUT_MS;
    let rows;
    while(true){
        rows = await json('/job_rows');
        if(!rows.sessions.includes(OLD_SESSION_PASS_STRING) && !rows.usedHashes.includes(EXPIRED_USED_HASH)
            && rows.notifications == 0 && mailBlocksTo(NOTIFIED_EMAIL).some(block => block.Text)) break;
        if(Date.now() > deadline) throw new Error(`the alarm left ${JSON.stringify(rows)}:\n${output}`);
        await new Promise(resolve => setTimeout(resolve, READY_POLL_MS));
    }

    assert.ok(rows.sessions.includes(adminPassString), `${rows.sessions}`);
    assert.ok(rows.usedHashes.includes(UNEXPIRED_USED_HASH), `${rows.usedHashes}`);
    const blocks = mailBlocksTo(NOTIFIED_EMAIL);
    assert.equal(blocks.length, 1, output);
    assert.match(blocks[0].Subject, NOTIFICATION_SUBJECT_PATTERN);
    // Read now: the message files are gone once `wrangler dev` exits.
    assert.ok(readFileSync(blocks[0].Text, 'utf8').includes(NOTIFICATION_BODY));

    await nextAlarm();
});

test('publishing a post with "Email subscribers" mails the newsletter\'s subscribers from the alarm', async () => {
    assert.deepEqual(await json('/subscriber_rows'), { published: false });
    const { cookie, postId } = await adminSession();
    const body = new FormData();
    body.append('emailSubscribers', 'true');

    const response = await fetch(`${origin}${PUBLISH_POST_PATH}?id=${postId}`, {
        method: 'POST',
        headers: { accept: 'application/json', cookie: `${SESSION_COOKIE_NAME}=${cookie}` },
        body
    });
    const answer = await response.text();
    assert.equal(response.status, 200, answer);
    assert.match(answer, /<blognami-redirect/);

    // No request from here on: the alarm the publish set runs the queued job.
    const deadline = Date.now() + ALARM_TIMEOUT_MS;
    while(!mailBlocksTo(SUBSCRIBER_EMAIL).some(block => block.HTML)){
        if(Date.now() > deadline) throw new Error(`no message to ${SUBSCRIBER_EMAIL} was logged:\n${output}`);
        await new Promise(resolve => setTimeout(resolve, READY_POLL_MS));
    }

    const blocks = mailBlocksTo(SUBSCRIBER_EMAIL);
    assert.equal(blocks.length, 1, output);
    assert.ok(blocks[0].Subject.includes(SEEDED_POST_TITLE), blocks[0].Subject);
    // Read now: the message files are gone once `wrangler dev` exits.
    assert.ok(readFileSync(blocks[0].HTML, 'utf8').includes(`href="${origin}/${SEEDED_POST_PATH}"`));
    assert.equal(mailBlocksTo(UNSUBSCRIBED_EMAIL).length, 0, output);
});

test('a queued job that throws is logged once and the job queued after it still runs', async () => {
    const countMails = () => mailBlocksTo(SUBSCRIBER_EMAIL).filter(block => block.HTML).length;
    const sent = countMails();

    await json('/throwing_job');

    const deadline = Date.now() + ALARM_TIMEOUT_MS;
    while(countMails() == sent || !output.includes(JOB_ERROR_MESSAGE)){
        if(Date.now() > deadline) throw new Error(`${countMails() - sent} messages to ${SUBSCRIBER_EMAIL} were logged after the job that throws:\n${output}`);
        await new Promise(resolve => setTimeout(resolve, READY_POLL_MS));
    }

    assert.equal(countMails(), sent + 1, output);
    assert.equal(output.split(JOB_ERROR_MESSAGE).length - 1, 1, output);
    // A run Cloudflare was retrying would leave the alarm off the schedule's next occurrence.
    await nextAlarm();
});

// Last: it stops the `wrangler dev` the cases above share.
test('the schema and the seeded post survive a restart on the same state', async () => {
    assert.deepEqual(await (await fetch(`${origin}/seeded`)).json(), { posts: 1 });
    const { appliedMigrations } = await (await fetch(`${origin}/registry`)).json();

    await stopWrangler();
    await startWrangler();

    assert.match(await html(await fetch(`${origin}/`)), /Seeded post title/);
    assert.deepEqual(await (await fetch(`${origin}/seeded`)).json(), { posts: 1 });
    assert.deepEqual((await (await fetch(`${origin}/registry`)).json()).appliedMigrations, appliedMigrations);
    const served = await servedImage(featuredSrc);
    assert.ok(served.equals(featuredBytes), served.toString('hex'));
});
