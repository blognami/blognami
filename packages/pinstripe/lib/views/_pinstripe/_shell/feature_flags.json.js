
export default {
    async render(){
        return [200, {'content-type': 'text/json'}, [JSON.stringify(
            await this.featureFlags
        )]]
    }
};
