import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test('stripeProduct CRUD', () => Workspace.run(async _ => {
    const { stripeProducts } = _.database;

    assert.equal(await stripeProducts.count(), 0);

    const record = await stripeProducts.insert({
        name: 'starter',
        type: 'plan',
        stripeProductId: 'prod_test123'
    });

    assert.equal(await stripeProducts.count(), 1);
    assert.equal(record.name, 'starter');
    assert.equal(record.type, 'plan');
    assert.equal(record.stripeProductId, 'prod_test123');

    await record.update({ stripeProductId: 'prod_test456' });
    const updated = await stripeProducts.where({ name: 'starter' }).first();
    assert.equal(updated.stripeProductId, 'prod_test456');

    await record.delete();
    assert.equal(await stripeProducts.count(), 0);
}));

test('stripeProduct lookup by name and type', () => Workspace.run(async _ => {
    const { stripeProducts } = _.database;

    await stripeProducts.insert({
        name: 'starter',
        type: 'plan',
        stripeProductId: 'prod_plan1'
    });

    await stripeProducts.insert({
        name: 'publisher',
        type: 'plan',
        stripeProductId: 'prod_plan2'
    });

    const plan = await stripeProducts.where({ name: 'starter', type: 'plan' }).first();
    assert.equal(plan.stripeProductId, 'prod_plan1');

    const plan2 = await stripeProducts.where({ name: 'publisher', type: 'plan' }).first();
    assert.equal(plan2.stripeProductId, 'prod_plan2');

    const noMatch = await stripeProducts.where({ name: 'enterprise', type: 'plan' }).first();
    assert.equal(noMatch, undefined);
}));

test('stripeProduct validates required fields', () => Workspace.run(async _ => {
    const { stripeProducts } = _.database;

    try {
        await stripeProducts.insert({});
        assert.fail('Expected validation error');
    } catch (error) {
        const errors = JSON.parse(error.message);
        assert.equal(errors.name, 'Must not be blank');
        assert.equal(errors.type, 'Must not be blank');
        assert.equal(errors.stripeProductId, 'Must not be blank');
    }
}));
