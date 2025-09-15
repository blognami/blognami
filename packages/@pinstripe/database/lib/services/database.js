import { Database, Client } from "@pinstripe/database";

export default {
  create() {
    return this.defer(async () =>
      Database.new(
        await this.context.root.getOrCreate("databaseClient", async () =>
          Client.new(await this.config.database)
        ),
        this.context
      )
    );
  },
};
