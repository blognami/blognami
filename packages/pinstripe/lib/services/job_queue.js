
const queue = [];

export default {
    create(){
        return this.context.root.getOrCreate("jobQueue", () => this);
    },

    push(name, params = {}){
        queue.push({ name, params });
    },

    shift(){
        return queue.shift();
    },

    get length(){
        return queue.length;
    }
};
