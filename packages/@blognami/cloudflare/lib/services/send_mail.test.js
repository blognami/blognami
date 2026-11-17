import test from 'node:test';
import assert from 'node:assert';

import { ServiceFactory, importAll } from 'blognami';

import '../index.js';
import engineSendMail from '../../../../blognami/lib/services/send_mail.js';
import cloudflareSendMail from './send_mail.js';

test('on Node, with @blognami/cloudflare imported, sendMail is still the engine\'s', async () => {
    await importAll();

    assert.deepEqual(cloudflareSendMail, {});
    assert.equal(ServiceFactory.for('sendMail').prototype.create, engineSendMail.create);
});
