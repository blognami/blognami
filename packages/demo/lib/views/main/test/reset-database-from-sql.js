
export default {
    async render(){
        await this.database.destroy();

        await this.runCommand('reset-database-from-sql');

        return [200, {'content-type': 'text/json'}, [JSON.stringify({})]];
    }
}
