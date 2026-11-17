export default {
    async render(){
        return [200, { 'content-type': 'application/json' }, [JSON.stringify({
            isStorage: typeof this.initialParams._cloudflare?.DATABASE?.sql?.exec === 'function',
            rows: await this.database.run('select 1 as one')
        })]];
    }
};
