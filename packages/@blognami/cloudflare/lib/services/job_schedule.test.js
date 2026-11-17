import test, { before } from 'node:test';
import assert from 'node:assert';

import { importAll } from 'blognami';

import '../../test/project/lib/index.js';
import jobSchedule from './job_schedule.js';

const MINUTE_MS = 60 * 1000;
const SCHEDULE_INTERVAL_MS = 5 * MINUTE_MS;
const BOUNDARY = Date.UTC(2026, 0, 1, 12, 5);
const SCHEDULED_JOB_NAMES = ['deliver-notifications', 'purge-old-sessions', 'purge-used-hashes'];
const UNSCHEDULED_JOB_NAME = 'email-post-to-subscribers';

const dueJobNames = (after, until) => jobSchedule.findDueJobs(after, until).map(({ name }) => name).sort();

before(() => importAll());

test('jobSchedule - the engine\'s */5 jobs are due across a five-minute boundary', () => {
    const jobs = jobSchedule.findDueJobs(BOUNDARY - MINUTE_MS, BOUNDARY + MINUTE_MS);

    assert.deepEqual(jobs.map(({ name }) => name).sort(), SCHEDULED_JOB_NAMES);
    jobs.forEach(({ params }) => assert.deepEqual(params, {}));
});

test('jobSchedule - a job is due at its occurrence and not again after it', () => {
    assert.deepEqual(dueJobNames(BOUNDARY - MINUTE_MS, BOUNDARY), SCHEDULED_JOB_NAMES);
    assert.deepEqual(dueJobNames(BOUNDARY, BOUNDARY + MINUTE_MS), []);
});

test('jobSchedule - no job is due inside a five-minute interval', () => {
    assert.deepEqual(jobSchedule.findDueJobs(BOUNDARY + MINUTE_MS, BOUNDARY + 4 * MINUTE_MS), []);
});

test('jobSchedule - a schedule that fell due several times is returned once', () => {
    assert.deepEqual(dueJobNames(BOUNDARY - MINUTE_MS, BOUNDARY + 16 * MINUTE_MS), SCHEDULED_JOB_NAMES);
});

test('jobSchedule - the next occurrence is the next whole five minutes after a time', () => {
    assert.equal(jobSchedule.findNextOccurrence(BOUNDARY - MINUTE_MS), BOUNDARY);
    assert.equal(jobSchedule.findNextOccurrence(BOUNDARY), BOUNDARY + SCHEDULE_INTERVAL_MS);
});

test('jobSchedule - a job with no schedule is never due', () => {
    assert.ok(!dueJobNames(0, BOUNDARY).includes(UNSCHEDULED_JOB_NAME));
});
