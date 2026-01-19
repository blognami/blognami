
const queue = [];

export default {
    create(){
        return this.context.root.getOrCreate("backgroundJobQueue", () => this);
    },

    async push(name, params = {}){
        queue.push({ name, params });
    },

    async shift(){
        return queue.shift();
    },

    async length(){
        return queue.length;
    }
};
