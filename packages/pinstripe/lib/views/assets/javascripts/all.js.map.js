
export default {
    async render(){
        const { map } = await this.clientBuilder.build();
        return [200, { 'content-type': 'application/json'}, [ map ]];
    }
};
