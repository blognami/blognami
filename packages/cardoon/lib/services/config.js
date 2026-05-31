
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { pathToFileURL } from 'url';

const findProjectRoot = (dir) => {
    while (true) {
        if (existsSync(join(dir, '.cardoon'))) return dir;
        const parent = dirname(dir);
        if (parent === dir) return undefined;
        dir = parent;
    }
};

export default {
    create(){
        return this.defer(async () => this.context.root.getOrCreate('config', async () => {
            const projectRoot = findProjectRoot(process.cwd());
            if (!projectRoot) return {};
            const configPath = join(projectRoot, '.cardoon', 'config.js');
            if (!existsSync(configPath)) return {};
            try {
                const mod = await import(pathToFileURL(configPath).href);
                return mod.default || {};
            } catch {
                return {};
            }
        }));
    }
};
