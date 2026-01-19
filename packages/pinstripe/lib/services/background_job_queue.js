
export default {
    create(){
        return this.context.root.getOrCreate("backgroundJobQueue", () => this);
    },

    _queue: [],

    async push(name, params = {}){
        this._queue.push({ name, params });
    },

    async shift(){
        return this._queue.shift();
    },

    async length(){
        return this._queue.length;
    }
};
