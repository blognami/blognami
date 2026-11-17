// The schema the database client reads from the object's storage, so a test can tell a table it gained.
export default {
    async render(){
        return [200, { 'content-type': 'application/json' }, [JSON.stringify(await this.database.client.extractSchema())]];
    }
};
