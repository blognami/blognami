
export const thatify = fn => {
    return function(...args){
        return fn(this, ...args);
    };
};
