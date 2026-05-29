
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

import docker from './docker.js';

const ok = (stdout = '') => ({ exitCode: 0, stdout, stderr: '' });
const fail = (stderr = '') => ({ exitCode: 1, stdout: '', stderr });

describe('docker sandbox – spinner integration', () => {
    let instance;
    let spinnerCalls;
    let execLog;

    beforeEach(() => {
        spinnerCalls = [];
        execLog = [];

        instance = Object.create(docker);
        instance._resolveSettings = async () => ({
            projectRoot: '/fake',
            name: 'test-sandbox',
            tag: 'test-sandbox',
        });
        instance.spinner = {
            run: async (label, fn, opts) => {
                spinnerCalls.push({ label, opts });
                return fn();
            },
        };
    });

    function stubExec(...responses) {
        let idx = 0;
        instance._exec = async (cmd, args) => {
            execLog.push([cmd, ...args]);
            return responses[idx++];
        };
    }

    it('calls spinner with "Building sandbox image" when image inspect fails', async () => {
        stubExec(
            fail(),           // docker image inspect → not found
            ok(),             // docker build → success (inside spinner)
            ok('true'),       // docker inspect container → running
        );

        await instance.start();

        assert.strictEqual(spinnerCalls.length, 1);
        assert.strictEqual(spinnerCalls[0].label, 'Building sandbox image');
        assert.deepStrictEqual(spinnerCalls[0].opts, { success: 'Built sandbox image' });
    });

    it('does not call spinner when image already exists', async () => {
        stubExec(
            ok(),             // docker image inspect → found
            ok('true'),       // docker inspect container → running
        );

        await instance.start();

        assert.strictEqual(spinnerCalls.length, 0);
    });

    it('calls spinner with "Creating sandbox container" when container inspect fails', async () => {
        stubExec(
            ok(),             // docker image inspect → found
            fail(),           // docker inspect container → not found
            ok(),             // docker run → success (inside spinner)
        );

        await instance.start();

        assert.strictEqual(spinnerCalls.length, 1);
        assert.strictEqual(spinnerCalls[0].label, 'Creating sandbox container');
        assert.deepStrictEqual(spinnerCalls[0].opts, { success: 'Created sandbox container' });
    });

    it('does not call container-create spinner when container already running', async () => {
        stubExec(
            ok(),             // docker image inspect → found
            ok('true'),       // docker inspect container → running
        );

        await instance.start();

        const containerSpinners = spinnerCalls.filter(c => c.label === 'Creating sandbox container');
        assert.strictEqual(containerSpinners.length, 0);
    });

    it('race-handling poll runs inside spinner when docker run returns "name already in use"', async () => {
        stubExec(
            ok(),                                        // docker image inspect → found
            fail(),                                      // docker inspect container → not found
            fail('name already in use'),                 // docker run → race conflict (inside spinner)
            ok('false'),                                 // poll inspect → not ready yet
            ok('true'),                                  // poll inspect → running
        );

        await instance.start();

        assert.strictEqual(spinnerCalls.length, 1);
        assert.strictEqual(spinnerCalls[0].label, 'Creating sandbox container');
        const inspectPolls = execLog.filter(
            c => c[0] === 'docker' && c[1] === 'inspect' && c.includes('test-sandbox')
        );
        assert.ok(inspectPolls.length >= 2, 'expected at least 2 inspect polls during race handling');
    });
});
