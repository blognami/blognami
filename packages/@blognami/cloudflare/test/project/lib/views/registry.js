// Stands in for `list-jobs` and the applied migrations, which print to a console on Node.
export default {
    async render(){
        const appliedMigrations = await this.database.table('appliedMigrations').orderBy('schemaVersion').all();
        return [200, { 'content-type': 'application/json' }, [JSON.stringify({
            jobs: this.engine.Job.names,
            appliedMigrations: appliedMigrations.map(({ schemaVersion }) => schemaVersion)
        })]];
    }
};
