
import { Base } from './base.js';

test(`Base - initialize won't call magic methods`, async () => {
    const fixture = Base.extend().include({
        initialize(){
            this.foo = 'bar';
        },

        __getMissing(name){
            return 'baz';
        }
    }).new();

    expect(fixture.bar).toBe("baz");
    expect(fixture.foo).toBe("bar");
});

test('Base - magic methods should callable from getters', async () => {
    const fixture = Base.extend().include({
        get foo(){
            return this.bar;
        },

        __getMissing(name){
            return 'baz';
        }
    }).new();

    expect(fixture.bar).toBe("baz");
    expect(fixture.foo).toBe("baz");
});

test(`Base - properties starting with an underscore won't invoke a magic method`, async () => {
    const fixture = Base.extend().include({
        get foo(){
            if(!this._foo){
                this._foo = 'bar';
            }
            return this._foo;
        },

        __getMissing(name){
            return 'baz';
        },

        __setMissing(name, value){
            
        }
    }).new();

    expect(fixture.bar).toBe("baz");
    expect(fixture.foo).toBe("bar");
});

test(`Base - if the __call has been defined getting/setting still works`, async () => {
    const fixture = Base.extend().include({
        initialize(){
            this.foo = "bar";
        },

        __call(...args){
            
        }
    }).new();

    expect(fixture.foo).toBe("bar");
});

test(`Base - can produce dynamic keys`, () => {
    const fixture = Base.extend().include({
        baz: 'hello world',

        __keys(){
            return ['foo', 'bar'];
        }
    }).new();

    expect(Object.keys(fixture)).toEqual(['foo', 'bar']);
});
