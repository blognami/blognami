import { Database, Client } from "@pinstripe/database";

export default {
  create() {
    return this.defer(async () => {
      const logger = await this.logger;
      const client = await this.context.root.getOrCreate("databaseClient", async () =>
        Client.new(await this.config.database, { logger })
      );
      // Ensure logger is set even if client was created before logger was available
      if (!client.logger && logger) {
        client.logger = logger;
      }
      return Database.new(client, this.context);
    });
  },
};
