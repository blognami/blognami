import { mkdir, writeFile, readFile, unlink } from 'fs/promises';
import { resolve } from 'path';
import crypto from 'crypto';

export default {
    create() {
        return this.defer(async () => {
            const config = await this.config;
            const basePath = config.blobStore?.path
                || resolve(`${await this.project.rootPath}/blob_store`);

            await mkdir(basePath, { recursive: true });

            return {
                async put(data) {
                    const id = crypto.randomUUID();
                    await writeFile(resolve(basePath, `${id}.bin`), data);
                    return id;
                },
                async get(id) {
                    try {
                        return await readFile(resolve(basePath, `${id}.bin`));
                    } catch(e) {
                        if(e.code === 'ENOENT') return null;
                        throw e;
                    }
                },
                async delete(id) {
                    try {
                        await unlink(resolve(basePath, `${id}.bin`));
                    } catch(e) {
                        if(e.code !== 'ENOENT') throw e;
                    }
                }
            };
        });
    }
};
