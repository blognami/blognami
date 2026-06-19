
export default {
    async render(){
        return [200, {'content-type': 'text/json'}, [JSON.stringify({
            version: await this.version,
            minWorkerVersion: (await this.project.config.minWorkerVersion) ?? '0'
        })]]
    }
};
