
import { existsSync } from 'fs';
import { realpath, readFile } from 'fs/promises';
import { registries } from 'pinstripe/util';

export default {
    async create(){
        if(!this.context.root.docs){
            this.context.root.docs = {
                apps: await this.extractDocs('App', 'apps'),
                commands: await this.extractDocs('Command', 'commands'),
                components: await this.extractDocs('Component', 'components'),
                migrations: await this.extractDocs('Migration', 'migrations'),
                models: await this.extractDocs('Row', 'models'),
                services: await this.extractDocs('ServiceFactory', 'services'),
                views: await this.extractDocs('View', 'views'),
            };
        }
        return this.context.root.docs;
    },



    async extractDocs(name, namespace){
        const out = {};
        const registry = registries[name];
        const { names } =  registry;
        for(let name of names){
            const slug = `${namespace}/${name}`;

            const Class = registry.for(name);
            
            const filePath = Class.filePaths[Class.filePaths.length - 1];

            if(!filePath || !filePath.match(/\.(js|css)/)) continue;

            const packageRootPath = await this.getPackageRootPath(filePath);
            
            if(packageRootPath == undefined) continue;
            
            const packageJson = await this.getPackageJson(packageRootPath);

            const packageName = packageJson.name;
            
            const packageRelativePath = filePath.substr(packageRootPath.length).replace(/^\//, '');
            const repositoryRelativePath = `${packageJson.repository?.directory ? `${packageJson.repository.directory}/` : ''}${packageRelativePath}`;

            const code = (await readFile(filePath)).toString('utf8');

            const markdown = code.split(/\/\*\//).map((segment, i) => {
                if(i % 2 == 0 && segment.trim().length){
                    return `\`\`\`\n${segment}\n\`\`\``;
                }
                return segment;
            }).join('');

            out[name] = {
                name,
                slug,
                packageName,
                packageRelativePath,
                repositoryRelativePath,
                markdown
            };
        }
        return out;
    },

    async getPackageRootPath(path){
        const packageJsonPath = (await this.findInPath('package.json', path.replace(/[^/]*$/, ''))).shift();
        if(!packageJsonPath) return;
        return packageJsonPath.replace(/package.json$/, '');
    },

    async getPackageJson(packageRootPath){
        return JSON.parse((await readFile(`${packageRootPath}package.json`)).toString('utf8'));
    },

    async findInPath(offset, base){
        const out = [];
        while(base) {
            const candidatePath = `${base}/${offset}`;
            if(existsSync(candidatePath)){
                out.push(await realpath(candidatePath));
            }
            if(base == '/'){
                break;
            }
            base = await realpath(`${base}/..`);
        }
        return out;
    }
};
