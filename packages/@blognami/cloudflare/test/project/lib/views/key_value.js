// Reads a key of the object's key-value storage, after putting the JSON in `value` under it when one is given.
export default {
    async render(){
        const storage = this.initialParams._cloudflare.DATABASE;
        const { key, value } = this.params;
        if(value !== undefined) await storage.put(key, JSON.parse(value));
        return [200, { 'content-type': 'application/json' }, [JSON.stringify({
            // null, as JSON leaves out a key that was never put.
            value: await storage.get(key) ?? null
        })]];
    }
};
