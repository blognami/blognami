import { Database, Client } from "@pinstripe/database";

export default {
  create() {
    return this.defer(async () =>
       Database.new(
        await this.context.root.getOrCreateWithLock(
          "databaseClient",
          async () => Client.new(await this.config.database)
        ),
        this.context
      )
    );
  },
};
