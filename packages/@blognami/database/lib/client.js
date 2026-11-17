import { Class, AsyncLock } from '@blognami/utils';

// Imported only by the adapter that uses them; read from an object so no bundler resolves them.
const specifiers = { mysql: 'mysql2', sqlite: 'sqlite3', fs: 'fs' };

let mysql;
let sqlite;

const lockAsyncLock = AsyncLock.new();
const transactionAsyncLock = AsyncLock.new();

let connection;
let connectionCounter = 0;
let connectionPromise;
let silencePromise;
let activeOperations = 0;
let drainResolve;

export const Client = Class.extend().include({
    initialize(config){
        this.config = config;
        this.lockLevel = 0;
        this.transactionLevel = 0;
        this.cache = {};
        this.connected = false;
    },

    clone(){
        const cloned = Client.new(this.config);
        cloned.lockLevel = this.lockLevel;
        cloned.transactionLevel = this.transactionLevel;
        return cloned;
    },

    async run(query, options = {}){
        while(
            silencePromise
            && !options.skipSilencePromise
            && !this.lockLevel
            && !this.transactionLevel
        ) await silencePromise;

        return trackActivity(async () => {
            if(!this.connected){
                this.connected = true;
                connectionCounter++;
            }

            while(connectionPromise && !options.skipConnectionPromise) await connectionPromise;

            if(!connection){
                connectionPromise = this.adapt(this, {
                    async mysql(){
                        const { adapter, database, ...connectionConfig } = this.config;
                        if(!mysql) mysql = (await import(specifiers.mysql)).default;
                        connection = mysql.createPool({
                            ...connectionConfig,
                            waitForConnections: true,
                            connectionLimit: 1,
                            queueLimit: 0,
                            enableKeepAlive: true,
                            keepAliveInitialDelay: 10000
                        });
                        const bootstrapOptions = { skipConnectionPromise: true, skipSilencePromise: true };
                        const databases = (await this.run('show databases', bootstrapOptions)).map(row => row['Database']);
                        if(!databases.includes(database)){
                            await this.run(`create database ${database}`, bootstrapOptions);
                        }
                        await this.run(`use ${database}`, bootstrapOptions);
                    },

                    async sqlite(){
                        const { filename } = this.config;
                        if(!sqlite) sqlite = (await import(specifiers.sqlite)).default;
                        connection = new sqlite.Database(filename);
                        connection.configure('busyTimeout', 10000);
                    },

                    async durableObject(){
                        // No connection to open, and none kept at module level: each client
                        // reaches its own object's storage through `this.config.storage`.
                    }
                });
                await connectionPromise;
                connectionPromise = undefined;
            }

            return run.call(this, ...prepare.call(this, await resolveQuery(query)));
        });
    },

    async lock(fn){
        while(
            silencePromise
            && !this.lockLevel
            && !this.transactionLevel
        ) await silencePromise;

        return trackActivity(async () => {
            let out;
            this.lockLevel++;
            await lockAsyncLock.lock({ skip: this.lockLevel > 1 }, async () => {
                await this.adapt(this, {
                    async mysql(){
                        if(this.lockLevel == 1){
                            await this.run(`select get_lock('blognami_lock', -1)`);
                        }

                        try {
                            out = await fn();
                        } catch(e){
                            this.lockLevel = 0;
                            await this.run(`select release_lock('blognami_lock')`);
                            throw e;
                        }

                        if(this.lockLevel == 1){
                            await this.run(`select release_lock('blognami_lock')`);
                        }
                    },

                    async sqlite(){
                        out = await this.transaction(fn);
                    }
                });
            });
            this.lockLevel--;
            return out;
        });
    },

    async transaction(fn){
        while(
            silencePromise
            && !this.lockLevel
            && !this.transactionLevel
        ) await silencePromise;

        return trackActivity(async () => {
            let out;
            this.transactionLevel++;
            await transactionAsyncLock.lock({ skip: this.transactionLevel > 1 }, async () => {
                if(this.transactionLevel == 1){
                    await this.adapt(this, {
                        async mysql(){
                            await this.run('start transaction');
                        },

                        async sqlite(){
                            await this.run('pragma locking_mode = exclusive');
                            await this.run('begin exclusive transaction');
                        },

                        async durableObject(){
                            // No statement: `sql.exec` refuses `begin`. The outermost `fn` is
                            // handed to `storage.transaction()` below instead.
                        }
                    });
                }

                try {
                    out = await this.adapt(this, {
                        mysql(){
                            return fn();
                        },

                        sqlite(){
                            return fn();
                        },

                        async durableObject(){
                            if(this.transactionLevel > 1) return fn();

                            let out;
                            let rolledBack = false;
                            try {
                                await this.config.storage.transaction(async () => {
                                    out = await fn();
                                    if(this.transactionFailed){
                                        // An inner transaction threw and `fn` caught it: throw, so
                                        // the storage rolls back everything `fn` wrote.
                                        rolledBack = true;
                                        throw new Error('An inner transaction threw.');
                                    }
                                });
                            } catch(e){
                                if(!rolledBack) throw e;
                            } finally {
                                this.transactionFailed = false;
                                this.transactionLevel = 1;
                            }
                            return out;
                        }
                    });
                } catch(e){
                    if(this.transactionLevel > 0) await this.adapt(this, {
                        async mysql(){
                            await this.run('rollback');
                        },

                        async sqlite(){
                            await this.run('rollback');
                            await this.run('pragma locking_mode = normal');
                        },

                        async durableObject(){
                            // No statement: the throw leaving `storage.transaction()` rolls back.
                            // An inner throw may be caught by the outer `fn`, so it is marked.
                            if(this.transactionLevel > 1) this.transactionFailed = true;
                        }
                    });
                    this.transactionLevel = 0;
                    throw e;
                }

                if(this.transactionLevel == 1) await this.adapt(this, {
                    async mysql(){
                        await this.run('commit');
                    },

                    async sqlite(){
                        await this.run('commit');
                        await this.run('pragma locking_mode = normal');
                    },

                    async durableObject(){
                        // No statement: `storage.transaction()` committed when `fn` returned.
                    }
                });
            });
            this.transactionLevel--;
            return out;
        });
    },

    async drop(){
        await this.withSilence(async () => {
            await this.adapt(this, {
                async sqlite(){
                    const { existsSync, unlinkSync } = await import(specifiers.fs);
                    if(existsSync(this.config.filename)){
                        unlinkSync(this.config.filename);
                    }
                },
                async mysql(){
                    await this.run(
                        `drop database ${this.config.database}`,
                        { skipSilencePromise: true }
                    );
                },
                async durableObject(){
                    await this.config.storage.deleteAll();
                }
            });
        });
    },

    async destroy(){
        this.cache = {};
        if(!this.connected) return;
        this.connected = false;
        connectionCounter--;
        if(connectionCounter > 0 || !connection) return;
        const _connection = connection;
        connection = undefined;
        await this.adapt(this, {
            async mysql(){
                await _connection.end();
            },

            async sqlite(){
                await new Promise((resolve, reject) => {
                    _connection.close(error => error ? reject(error) : resolve());
                });
            }
        });
    },

    async withSilence(fn){
        while(silencePromise) await silencePromise;
        let releaseSilence;
        silencePromise = new Promise(resolve => { releaseSilence = resolve; });

        const closeConnection = async () => {
            if(!connection) return;
            const _connection = connection;
            connection = undefined;
            try {
                await this.adapt(this, {
                    async mysql(){ await _connection.end(); },
                    async sqlite(){
                        await new Promise((resolve, reject) => {
                            _connection.close(error => error ? reject(error) : resolve());
                        });
                    }
                });
            } catch {}
        };

        try {
            if(activeOperations > 0){
                await new Promise(resolve => { drainResolve = resolve; });
            }
            await closeConnection();
            return await fn();
        } finally {
            await closeConnection();
            silencePromise = undefined;
            releaseSilence();
        }
    },

    adapt(...args){
        const[ alternatives, that ] = args.reverse();
        const { adapter } = this.config;
        // A Durable Object's storage is SQLite, so a site's sqlite alternative is right for durableObject too.
        const fn = alternatives[adapter] || (adapter == 'durableObject' ? alternatives.sqlite : undefined);
        if(!fn) throw new Error(`"${adapter}" adapter not supported.`);
        return fn.call(that);
    },

    async extractSchema(){
        const out = {};

        // Create columnTypes table if it doesn't exist using low-level SQL
        await this.adapt(this, {
            async mysql(){
                await this.run(`
                    create table if not exists \`columnTypes\` (
                        _id int(11) unsigned auto_increment primary key,
                        id binary(16) not null,
                        tableName varchar(255) not null,
                        columnName varchar(255) not null,
                        columnType varchar(255) not null,
                        index(id),
                        index(tableName)
                    )
                `);
            },
            async sqlite(){
                await this.run(`
                    create table if not exists \`columnTypes\` (
                        _id integer primary key autoincrement,
                        id varchar not null,
                        tableName varchar not null,
                        columnName varchar not null,
                        columnType varchar not null
                    )
                `);
                await this.run(`create index if not exists index__columnTypes__id on \`columnTypes\` (id)`);
                await this.run(`create index if not exists index__columnTypes__tableName on \`columnTypes\` (tableName)`);
            }
        });

        // Get all table names
        const tableNames = await this.adapt(this, {
            async mysql(){
                const rows = await this.run('show tables');
                return rows.map(row => Object.values(row)[0]);
            },
            async sqlite(){
                const rows = await this.run(`select name from sqlite_schema where type ='table' and name not like 'sqlite_%'`);
                return rows.map(({ name }) => name);
            },
            async durableObject(){
                // Also without the tables the runtime keeps: local workerd's and Cloudflare's `_cf_` ones.
                const rows = await this.run(`select name from sqlite_schema where type ='table' and name not like 'sqlite_%' and name != '__miniflare_do_name' and name not glob '_cf_*'`);
                return rows.map(({ name }) => name);
            }
        });

        // Get all column types from columnTypes table
        const columnTypeRows = await this.run('select tableName, columnName, columnType from `columnTypes`');

        // Build schema for each table
        for (const tableName of tableNames) {
            const columns = {
                _id: 'primary_key',
                id: 'alternate_key'
            };

            // Special handling for columnTypes table - its columns are created directly via SQL
            if (tableName === 'columnTypes') {
                columns.tableName = 'string';
                columns.columnName = 'string';
                columns.columnType = 'string';
            } else {
                for (const row of columnTypeRows) {
                    if (row.tableName === tableName) {
                        columns[row.columnName] = row.columnType;
                    }
                }
            }

            out[tableName] = columns;
        }

        return out;
    }
});


async function trackActivity(fn){
    activeOperations++;
    try {
        return await fn();
    } finally {
        activeOperations--;
        if(activeOperations === 0 && drainResolve){
            const resolve = drainResolve;
            drainResolve = undefined;
            resolve();
        }
    }
}

async function resolveQuery(query){
    let out = await query;
    if(Array.isArray(out)){
        out = [ ...out ];
        for(let i = 0; i < out.length; i++){
            out[i] = await resolveQuery(out[i]);
        }
    }
    return out;
}

function flattenFirst(query){
    if(!Array.isArray(query[0])) return query;
    return flattenFirst([...query[0], ...query.slice(1)]);
}

function prepare(query){
    const preparedQuery = [];
    const values = [];
    let normalizedQuery = query;
    if(!Array.isArray(normalizedQuery)) normalizedQuery = [ normalizedQuery ];
    normalizedQuery = [ ...normalizedQuery ];
    while(normalizedQuery.length){
        normalizedQuery = flattenFirst(normalizedQuery);
        preparedQuery.push(normalizedQuery.shift().replace(/\?/g, () => {
            let value = normalizedQuery.shift();
            if(typeof value?.toSql == 'function') return value.toSql();
            return this.adapt({
                mysql(){
                    if(typeof value == 'boolean') return `'${value}'`;
                    return mysql.escape(value);
                },

                sqlite(){
                    values.push(value);
                    return '?';
                },

                durableObject(){
                    // As sqlite3 binds them: a boolean as the integer 1 or 0, written into the
                    // query because `sql.exec` binds every number as a real, and a Date as its
                    // milliseconds.
                    if(typeof value == 'boolean') return value ? '1' : '0';
                    values.push(value instanceof Date ? value.getTime() : value);
                    return '?';
                }
            });
        }));
    }
    return [ preparedQuery.join(''), values ];
}

function run(query, values){
    const cacheKey = JSON.stringify([query, values]);

    const isTest = process.env.NODE_ENV == 'test';
    
    return this.adapt(this, {
        async mysql(){
            if(query.match(/^\s*(create|drop|alter|insert|update|delete)/im)){
                this.cache = {};
            }
            
            const cache = query.match(/^\s*select/im) ? this.cache : undefined;

            if(cache && cache[cacheKey]) return [...cache[cacheKey]];

            if(!isTest) console.log(`Query: ${query}`);

            const executeQuery = () => new Promise((resolve, reject) => {
                connection.query(query, (error, rows) => {
                    if(error){
                        reject(error);
                    } else {
                        if(!Array.isArray(rows)){
                            rows = [rows || {}];
                        }
                        resolve(rows);
                    }
                });
            });

            let out;
            try {
                out = await executeQuery();
            } catch(error) {
                const retryableErrors = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST'];
                if(retryableErrors.includes(error.code)){
                    out = await executeQuery();
                } else {
                    throw error;
                }
            }

            if(cache) cache[cacheKey] = out;

            return  [...out];
        },

        async sqlite(){
            if(query.match(/^\s*(create|drop|alter|insert|update|delete)/im)){
                this.cache = {};
            }

            const cache = query.match(/^\s*select/im) && !query.match(/^\s*(select\s+([\s\S]+?)\s+from\s+sqlite_schema|pragma)/im) ? this.cache : undefined;

            if(cache && cache[cacheKey]) return [...cache[cacheKey]];

            if(!isTest) console.log(`Query: ${query}`);

            const out = await new Promise((resolve, reject) => {
                connection.all(query, ...values, (error, rows) => {
                    if(error){
                        reject(error);
                    } else {
                        if(!Array.isArray(rows)){
                            rows = [rows || {}];
                        }
                        resolve(rows);
                    }
                });
            });

            if(cache) cache[cacheKey] = out;

            return  [...out];
        },

        async durableObject(){
            if(query.match(/^\s*(create|drop|alter|insert|update|delete)/im)){
                this.cache = {};
            }

            const cache = query.match(/^\s*select/im) && !query.match(/^\s*(select\s+([\s\S]+?)\s+from\s+sqlite_schema|pragma)/im) ? this.cache : undefined;

            if(cache && cache[cacheKey]) return [...cache[cacheKey]];

            if(!isTest) console.log(`Query: ${query}`);

            // `sql.exec` is synchronous; the cursor is consumed at once, before any await.
            const out = this.config.storage.sql.exec(query, ...values).toArray();

            // A blob comes back as an ArrayBuffer; sqlite3 gives a Buffer, itself a Uint8Array.
            for(const row of out){
                for(const name in row){
                    if(row[name] instanceof ArrayBuffer) row[name] = new Uint8Array(row[name]);
                }
            }

            if(cache) cache[cacheKey] = out;

            return  [...out];
        }
    });
}
