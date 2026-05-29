import { mkdirSync, readdirSync } from 'node:fs';
import { appendFile } from 'node:fs/promises';
import { join } from 'node:path';

const VALID = /^[a-zA-Z0-9_-]+$/;

export default {
    create(){
        return this.defer(async () => this.context.root.getOrCreate('logger', async () => {
            const project = await this.project;
            const parentDir = process.env.SARTOR_PARENT_SESSION_DIR;
            const root = parentDir
                ? join(parentDir, 'sessions')
                : join(project.rootPath, '.sartor', 'logs', 'sessions');
            let dir = null;
            const allocate = () => {
                if(dir) return dir;
                dir = this.allocateDir(root);
                return dir;
            };
            return this.createLogger(allocate, 'index');
        }));
    },

    allocateDir(root){
        mkdirSync(root, { recursive: true });
        let max = 0;
        for(const e of readdirSync(root, { withFileTypes: true })){
            if(!e.isDirectory()) continue;
            if(!/^\d{4}$/.test(e.name)) continue;
            const n = parseInt(e.name, 10);
            if(n > max) max = n;
        }
        const dir = join(root, String(max + 1).padStart(4, '0'));
        mkdirSync(dir, { recursive: true });
        return dir;
    },

    createLogger(allocate, name){
        const self = this;
        let queue = Promise.resolve();
        return {
            get sessionDir(){ return allocate(); },
            log(text){
                if(typeof text !== 'string') throw new TypeError('logger.log: text must be a string');
                const write = queue.then(() => appendFile(join(allocate(), `${name}.md`), text + '\n'));
                queue = write.catch(() => {});
                return write;
            },
            child({ name: childName }){
                if(typeof childName !== 'string' || !VALID.test(childName)){
                    throw new Error(`logger.child: invalid name ${JSON.stringify(childName)}`);
                }
                return self.createLogger(allocate, childName);
            }
        };
    }
};
