import test from 'node:test';
import assert from 'node:assert';

import { Class } from './class.js';
import { Context } from './context.js';
import { AbstractServiceFactory } from './abstract_service_factory.js';

const ServiceFactory = Class.extend().include({
    meta(){
        this.include(AbstractServiceFactory);
        this.include(this.Consumerable);
    }
});

const Consumer = Class.extend().include({
    meta(){ this.include(ServiceFactory.Consumerable); }
});

test('every ServiceFactory inherits a params service that returns the context params', () => {
    return Context.new().run(context => {
        context.params = { branch: 'foo' };
        const params = ServiceFactory.create('params', context).create();
        assert.deepEqual(params, { branch: 'foo' });
    });
});

test('the params service memoizes an empty object when the context has none', () => {
    return Context.new().run(context => {
        const first = ServiceFactory.create('params', context).create();
        assert.deepEqual(first, {});
        assert.equal(ServiceFactory.create('params', context).create(), first);
    });
});

test('a Consumerable resolves this.params through the inherited service', () => {
    return Context.new().run(context => {
        context.params = { branch: 'foo' };
        assert.deepEqual(Consumer.new(context).params, { branch: 'foo' });
    });
});
