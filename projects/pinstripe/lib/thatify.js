
export const thatify = fn => {
    return function(...args){
        return fn.call(this, this, ...args);
    };
};
