
export const components = {};

export const defineComponent = (name, fn) => {
    const previousFn = components[name];
    components[name] = function(){
        return fn.call(this, previousFn);
    };
};
