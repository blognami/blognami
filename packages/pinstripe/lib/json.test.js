import test from 'node:test';
import assert from 'node:assert';

import { Json } from "./json.js";

test("Json.resolveValue - primitive values", async () => {
    assert.equal(await Json.resolveValue('hello'), 'hello');
    assert.equal(await Json.resolveValue(42), 42);
    assert.equal(await Json.resolveValue(true), true);
    assert.equal(await Json.resolveValue(false), false);
    assert.equal(await Json.resolveValue(null), null);
    assert.equal(await Json.resolveValue(undefined), undefined);
});

test("Json.resolveValue - promises", async () => {
    assert.equal(await Json.resolveValue(Promise.resolve('hello')), 'hello');
    assert.equal(await Json.resolveValue(Promise.resolve(42)), 42);
    assert.equal(await Json.resolveValue(Promise.resolve(true)), true);
});

test("Json.resolveValue - objects with toJson method", async () => {
    const objWithToJson = {
        value: 'test',
        toJson() {
            return { transformed: this.value };
        }
    };
    assert.deepEqual(await Json.resolveValue(objWithToJson), { transformed: 'test' });
});

test("Json.resolveValue - objects with async toJson method", async () => {
    const objWithAsyncToJson = {
        value: 'test',
        async toJson() {
            return Promise.resolve({ transformed: this.value });
        }
    };
    assert.deepEqual(await Json.resolveValue(objWithAsyncToJson), { transformed: 'test' });
});

test("Json.resolveValue - promised objects with toJson method", async () => {
    const objWithToJson = {
        value: 'test',
        toJson() {
            return { transformed: this.value };
        }
    };
    assert.deepEqual(await Json.resolveValue(Promise.resolve(objWithToJson)), { transformed: 'test' });
});

test("Json.resolveValue - functions returning values", async () => {
    assert.equal(await Json.resolveValue(() => 'hello'), 'hello');
    assert.equal(await Json.resolveValue(() => 42), 42);
    assert.equal(await Json.resolveValue(() => Promise.resolve('async')), 'async');
});

test("Json.resolveValue - nested functions", async () => {
    assert.equal(await Json.resolveValue(() => () => 'nested'), 'nested');
    assert.equal(await Json.resolveValue(() => () => () => 'deeply nested'), 'deeply nested');
});

test("Json.resolveValue - simple arrays", async () => {
    assert.deepEqual(await Json.resolveValue([1, 2, 3]), [1, 2, 3]);
    assert.deepEqual(await Json.resolveValue(['a', 'b', 'c']), ['a', 'b', 'c']);
});

test("Json.resolveValue - arrays with promises", async () => {
    assert.deepEqual(
        await Json.resolveValue([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]),
        [1, 2, 3]
    );
});

test("Json.resolveValue - arrays with functions", async () => {
    assert.deepEqual(
        await Json.resolveValue([() => 'a', () => 'b', () => 'c']),
        ['a', 'b', 'c']
    );
});

test("Json.resolveValue - arrays with objects having toJson", async () => {
    const items = [
        { value: 1, toJson() { return this.value; } },
        { value: 2, toJson() { return this.value; } },
        { value: 3, toJson() { return this.value; } }
    ];
    assert.deepEqual(await Json.resolveValue(items), [1, 2, 3]);
});

test("Json.resolveValue - arrays with mixed types", async () => {
    assert.deepEqual(
        await Json.resolveValue([
            'string',
            42,
            Promise.resolve('promise'),
            () => 'function',
            { value: 'obj', toJson() { return this.value; } }
        ]),
        ['string', 42, 'promise', 'function', 'obj']
    );
});

test("Json.resolveValue - simple objects", async () => {
    assert.deepEqual(
        await Json.resolveValue({ a: 1, b: 2, c: 3 }),
        { a: 1, b: 2, c: 3 }
    );
});

test("Json.resolveValue - objects with promises", async () => {
    assert.deepEqual(
        await Json.resolveValue({
            a: Promise.resolve(1),
            b: Promise.resolve(2),
            c: Promise.resolve(3)
        }),
        { a: 1, b: 2, c: 3 }
    );
});

test("Json.resolveValue - objects with functions", async () => {
    assert.deepEqual(
        await Json.resolveValue({
            a: () => 'apple',
            b: () => 'banana',
            c: () => 'cherry'
        }),
        { a: 'apple', b: 'banana', c: 'cherry' }
    );
});

test("Json.resolveValue - objects with nested objects having toJson", async () => {
    assert.deepEqual(
        await Json.resolveValue({
            item: { value: 'test', toJson() { return this.value; } }
        }),
        { item: 'test' }
    );
});

test("Json.resolveValue - nested objects", async () => {
    assert.deepEqual(
        await Json.resolveValue({
            level1: {
                level2: {
                    level3: 'deep'
                }
            }
        }),
        { level1: { level2: { level3: 'deep' } } }
    );
});

test("Json.resolveValue - nested arrays", async () => {
    assert.deepEqual(
        await Json.resolveValue([[1, 2], [3, 4], [5, 6]]),
        [[1, 2], [3, 4], [5, 6]]
    );
});

test("Json.resolveValue - arrays with objects", async () => {
    assert.deepEqual(
        await Json.resolveValue([
            { a: 1, b: 2 },
            { c: 3, d: 4 }
        ]),
        [{ a: 1, b: 2 }, { c: 3, d: 4 }]
    );
});

test("Json.resolveValue - objects with arrays", async () => {
    assert.deepEqual(
        await Json.resolveValue({
            numbers: [1, 2, 3],
            letters: ['a', 'b', 'c']
        }),
        { numbers: [1, 2, 3], letters: ['a', 'b', 'c'] }
    );
});

test("Json.resolveValue - complex nested structure with mixed types", async () => {
    assert.deepEqual(
        await Json.resolveValue({
            user: {
                name: Promise.resolve('John'),
                age: () => 30,
                hobbies: [
                    'reading',
                    Promise.resolve('coding'),
                    () => 'gaming'
                ],
                address: {
                    city: 'New York',
                    zip: () => '10001'
                }
            },
            items: [
                { id: 1, toJson() { return { id: this.id, type: 'item' }; } },
                Promise.resolve({ id: 2, name: 'test' })
            ]
        }),
        {
            user: {
                name: 'John',
                age: 30,
                hobbies: ['reading', 'coding', 'gaming'],
                address: {
                    city: 'New York',
                    zip: '10001'
                }
            },
            items: [
                { id: 1, type: 'item' },
                { id: 2, name: 'test' }
            ]
        }
    );
});

test("Json.resolveValue - ensures immutability (creates new objects/arrays)", async () => {
    const original = { a: 1, b: [2, 3] };
    const resolved = await Json.resolveValue(original);
    
    assert.notStrictEqual(resolved, original);
    assert.notStrictEqual(resolved.b, original.b);
    assert.deepEqual(resolved, original);
});

test("Json.render - simple data", async () => {
    const json = await Json.render({ message: 'hello' });
    assert(json instanceof Json);
    assert.deepEqual(json.data, { message: 'hello' });
});

test("Json.render - data with promises", async () => {
    const json = await Json.render({
        message: Promise.resolve('hello'),
        count: Promise.resolve(42)
    });
    assert.deepEqual(json.data, { message: 'hello', count: 42 });
});

test("Json.render - data with functions", async () => {
    const json = await Json.render({
        message: () => 'hello',
        count: () => 42
    });
    assert.deepEqual(json.data, { message: 'hello', count: 42 });
});

test("Json.render - data with toJson method", async () => {
    const obj = {
        name: 'test',
        value: 123,
        toJson() {
            return { transformed: true, name: this.name };
        }
    };
    const json = await Json.render(obj);
    assert.deepEqual(json.data, { transformed: true, name: 'test' });
});

test("Json.render - complex nested data", async () => {
    const json = await Json.render({
        users: [
            { id: 1, name: Promise.resolve('Alice') },
            { id: 2, name: () => 'Bob' }
        ],
        meta: {
            total: Promise.resolve(2),
            page: () => 1
        }
    });
    assert.deepEqual(json.data, {
        users: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ],
        meta: {
            total: 2,
            page: 1
        }
    });
});

test("Json.toString - converts data to JSON string", async () => {
    const json = await Json.render({ message: 'hello', count: 42 });
    assert.equal(json.toString(), '{"message":"hello","count":42}');
});

test("Json.toString - handles arrays", async () => {
    const json = await Json.render([1, 2, 3]);
    assert.equal(json.toString(), '[1,2,3]');
});

test("Json.toString - handles nested structures", async () => {
    const json = await Json.render({
        user: { name: 'John', age: 30 },
        items: [1, 2, 3]
    });
    assert.equal(json.toString(), '{"user":{"name":"John","age":30},"items":[1,2,3]}');
});

test("Json.toResponseArray - default values", async () => {
    const json = await Json.render({ message: 'hello' });
    const response = json.toResponseArray();
    
    assert.deepEqual(response, [
        200,
        { 'content-type': 'application/json' },
        ['{"message":"hello"}']
    ]);
});

test("Json.toResponseArray - custom status", async () => {
    const json = await Json.render({ error: 'Not found' });
    const response = json.toResponseArray(404);
    
    assert.deepEqual(response, [
        404,
        { 'content-type': 'application/json' },
        ['{"error":"Not found"}']
    ]);
});

test("Json.toResponseArray - custom headers", async () => {
    const json = await Json.render({ data: 'test' });
    const response = json.toResponseArray(201, { 'x-custom': 'value' });
    
    assert.deepEqual(response, [
        201,
        { 'content-type': 'application/json', 'x-custom': 'value' },
        ['{"data":"test"}']
    ]);
});

test("Json.toResponseArray - overriding content-type", async () => {
    const json = await Json.render({ data: 'test' });
    const response = json.toResponseArray(200, { 'content-type': 'application/vnd.api+json' });
    
    assert.deepEqual(response, [
        200,
        { 'content-type': 'application/vnd.api+json' },
        ['{"data":"test"}']
    ]);
});

test("Json.new - creates instance with data", () => {
    const json = Json.new({ test: 'data' });
    assert(json instanceof Json);
    assert.deepEqual(json.data, { test: 'data' });
});

test("Json.new - can be called multiple times", () => {
    const json1 = Json.new({ a: 1 });
    const json2 = Json.new({ b: 2 });
    
    assert.deepEqual(json1.data, { a: 1 });
    assert.deepEqual(json2.data, { b: 2 });
    assert.notStrictEqual(json1, json2);
});

test("Json instance - initialize stores data", () => {
    const json = Json.new({ message: 'test' });
    assert.deepEqual(json.data, { message: 'test' });
});

test("Json - edge case with empty object", async () => {
    const json = await Json.render({});
    assert.deepEqual(json.data, {});
    assert.equal(json.toString(), '{}');
});

test("Json - edge case with empty array", async () => {
    const json = await Json.render([]);
    assert.deepEqual(json.data, []);
    assert.equal(json.toString(), '[]');
});

test("Json - edge case with null", async () => {
    const json = await Json.render(null);
    assert.equal(json.data, null);
    assert.equal(json.toString(), 'null');
});

test("Json - edge case with function returning object with toJson", async () => {
    const json = await Json.render(() => ({
        value: 'test',
        toJson() {
            return { transformed: this.value };
        }
    }));
    assert.deepEqual(json.data, { transformed: 'test' });
});

test("Json - edge case with promise resolving to function", async () => {
    const json = await Json.render(Promise.resolve(() => 'result'));
    assert.deepEqual(json.data, 'result');
});
