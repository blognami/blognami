import test from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

import { Bundle } from 'blognami';

import jsBundler from './js_bundler.js';

const fixture = `
console.log('client: unswapped'); // blognami-if(client): console.log('client: swapped');
console.log('server,service-worker: unswapped'); // blognami-if(server,service-worker): console.log('server,service-worker: swapped');
console.log('client,window: unswapped'); // blognami-if(client,window): console.log('client,window: swapped');
console.log('client,service-worker: unswapped'); // blognami-if(client,service-worker): console.log('client,service-worker: swapped');
`;

const expectedSwaps = {
    window: ['client', 'client,window'],
    clientServiceWorker: ['client', 'client,service-worker'],
    serviceWorker: ['server,service-worker']
};

const markers = ['client', 'server,service-worker', 'client,window', 'client,service-worker'];

Object.keys(expectedSwaps).forEach(name => {
    test(`jsBundler applies only the swaps whose flags the ${name} bundle carries`, async () => {
        const { js } = await jsBundler.buildBundle([fixture], Bundle.for(name).flags);

        markers.forEach(marker => {
            const swapped = expectedSwaps[name].includes(marker);
            assert.equal(js.includes(`'${marker}: swapped'`) || js.includes(`"${marker}: swapped"`), swapped, `blognami-if(${marker}) swapped in ${name}`);
            assert.equal(js.includes(`'${marker}: unswapped'`) || js.includes(`"${marker}: unswapped"`), !swapped, `blognami-if(${marker}) unswapped in ${name}`);
        });
    });
});

const pathFor = url => JSON.stringify(fileURLToPath(url));

Object.keys(expectedSwaps).forEach(name => {
    test(`jsBundler forces IS_SERVER true in the serviceWorker bundle alone (${name})`, async () => {
        const module = `import { IS_SERVER } from ${pathFor(import.meta.resolve('haberdash/lib/constants.js'))}; console.log(IS_SERVER);`;
        const { js } = await jsBundler.buildBundle([module], Bundle.for(name).flags);

        assert.equal(js.includes('IS_SERVER = true'), name == 'serviceWorker');
        assert.equal(js.includes('typeof addEventListener'), name != 'serviceWorker');
    });
});

test('jsBundler makes importAll do nothing in the serviceWorker bundle and keeps haberdash/node out', async () => {
    const module = `import { importAll } from ${pathFor(new URL('./import_all.js', import.meta.resolve('blognami')))}; console.log(importAll);`;
    const { js } = await jsBundler.buildBundle([module], Bundle.for('serviceWorker').flags);

    assert.match(js, /importAll = \(\) => \{\s*\}/);
    assert.equal(js.includes('haberdash/node/index.js'), false);
});
