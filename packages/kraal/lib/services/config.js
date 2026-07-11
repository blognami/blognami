
import { pathToFileURL } from 'url';

import { Project } from '../project.js';

export default {
    create(){
        return this.defer(async () => this.context.root.getOrCreate('config', async () => {
            const project = Project.instance;
            if (!project.exists) return {};
            const mod = await import(pathToFileURL(project.configPath).href);
            return mod.default || {};
        }));
    }
};
