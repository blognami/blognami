
export default {
    create(){
        return this.context.root.getOrCreate("backgroundJobQueue", () => this);
    },

    _queue: [],

    async push(name, ...args){
        this._queue.push({ name, args });
    },

    async shift(){
        return this._queue.shift();
    },

    async length(){
        return this._queue.length;
    }
};
