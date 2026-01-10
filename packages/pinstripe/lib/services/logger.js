
import { trapify } from '@pinstripe/utils';

const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

const LEVEL_COLORS = {
    error: '\x1b[31m',  // red
    warn: '\x1b[33m',   // yellow
    info: '\x1b[36m',   // cyan
    debug: '\x1b[90m'   // gray
};

const RESET = '\x1b[0m';

let createLoggerPromise;

export default {
    create(){
        return this.defer(() => {
            if(!createLoggerPromise){
                createLoggerPromise = this.createLogger();
            }
            return createLoggerPromise;
        });
    },

    async createLogger(){
        const { logger: userConfig = {} } = await this.config;
        const environment = process.env.NODE_ENV || 'development';
        const isProduction = environment === 'production';
        const isTest = environment === 'test';

        const defaultLevel = isTest ? 'error' : (isProduction ? 'warn' : 'info');

        const config = {
            level: userConfig.level || defaultLevel,
            categories: userConfig.categories || {},
            format: userConfig.format || (isProduction ? 'json' : 'pretty'),
            timestamps: userConfig.timestamps !== false,
            colors: userConfig.colors !== false && !isProduction,
            enabled: !isTest || userConfig.enableInTests
        };

        return trapify({
            config,

            __getMissing(target, name){
                return {
                    error: (msg, meta) => this.log('error', name, msg, meta),
                    warn: (msg, meta) => this.log('warn', name, msg, meta),
                    info: (msg, meta) => this.log('info', name, msg, meta),
                    debug: (msg, meta) => this.log('debug', name, msg, meta)
                };
            },

            shouldLog(level, category){
                if(!this.config.enabled) return false;
                const categoryLevel = this.config.categories[category] || this.config.level;
                return LOG_LEVELS[level] <= LOG_LEVELS[categoryLevel];
            },

            log(level, category, message, meta = {}){
                if(!this.shouldLog(level, category)) return;

                if(this.config.format === 'json'){
                    this.logJson(level, category, message, meta);
                } else {
                    this.logPretty(level, category, message, meta);
                }
            },

            logJson(level, category, message, meta){
                const entry = {
                    level,
                    category,
                    message,
                    ...meta,
                    ...(this.config.timestamps && { timestamp: new Date().toISOString() })
                };
                const output = level === 'error' ? console.error : console.log;
                output(JSON.stringify(entry));
            },

            logPretty(level, category, message, meta){
                const parts = [];

                if(this.config.timestamps){
                    const time = new Date().toISOString().slice(11, 23);
                    parts.push(this.config.colors ? `\x1b[90m${time}${RESET}` : time);
                }

                const levelStr = level.toUpperCase().padEnd(5);
                parts.push(this.config.colors ? `${LEVEL_COLORS[level]}${levelStr}${RESET}` : levelStr);

                const categoryStr = `[${category}]`;
                parts.push(this.config.colors ? `\x1b[36m${categoryStr}${RESET}` : categoryStr);

                parts.push(message);

                if(meta && Object.keys(meta).length > 0){
                    const metaStr = JSON.stringify(meta);
                    parts.push(this.config.colors ? `\x1b[90m${metaStr}${RESET}` : metaStr);
                }

                const output = level === 'error' ? console.error : console.log;
                output(parts.join(' '));
            }
        });
    }
};
