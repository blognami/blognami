export default {
    create(){
        return (...args) => this.matchViews(...args);
    },

    matchViews(pattern, options = {}){
        const out = [];

        return out;
    }
};