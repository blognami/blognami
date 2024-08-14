
export default {
    async render(){
        await this.database.destroy();

        await this.runCommand('database:reset-from-sql');

        return [200, {'content-type': 'text/json'}, [JSON.stringify({})]];
    }
}
