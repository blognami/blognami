export default {
    async render(){
        const { image } = this.params;
        return [ 200, { 'content-type': `image/${image.type}`}, [ await image.data ]];
    }
};