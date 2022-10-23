
export default {
    render(){
        const { type, data } = this.params.image;
        return [ 200, { 'content-type': `image/${type}`}, [ data ]];
    }
};