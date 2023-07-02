
import { readdir, readFile, stat, existsSync } from 'fs'; 
import { promisify } from 'util';
import Yaml from 'js-yaml';

export default {
    async run(){
        if(process.env.TENANCY == 'multi'){
            await this.database.tenants.insert({
                name: 'test',
                host: '127.0.0.1'
            });
        }
    
        if(process.env.SKIP_FIXTURES == 'true') return;
    
        await this.database.site.update({
            title: 'Lorem ipsum',
            description: [
                'Provident itaque iste.',
                '  * [Osinski Extensions](/osinski-extensions)'
            ].join('\n'),
            language: 'en'
        });
    
        this.user = await this.database.users.insert({
            name: 'Admin',
            email: 'admin@example.com',
            role: 'admin'
        });

        const { rootPath } = await this.project;
        const contentPath = `${rootPath}/content`;
        if(!existsSync(contentPath)) return;
        await this.loadDir(contentPath, contentPath);
    },

    async loadDir(dirPath, currentDirPath){
        const items = (await promisify(readdir)(currentDirPath)).reverse();
        for(let i in items){
            const item = items[i];
            const currentPath = `${currentDirPath}/${item}`;
            const stats = await promisify(stat)(currentPath);
            if(stats.isDirectory()){
                await this.loadDir(dirPath, currentPath);         
            } else {
                await this.loadFile(dirPath, currentPath);
            }
        }
    },

    async loadFile(dirPath, filePath){
        if(filePath.match(/\.md$/i)){
            await this.loadMarkdownFile(dirPath, filePath);
        }
    },

    async loadMarkdownFile(dirPath, filePath){
        const data = await promisify(readFile)(filePath, 'utf8');
        const [ frontMatter, body ] = this.extractFrontMatterAndBody(data);

        const entity = {
            userId: this.user.id,
            ...frontMatter,
            body
        };

        if(!entity.slug){
            entity.slug = filePath.replace(/^.*\//, '').replace(/\.[^/.]+$/, '');
        }

        if(!entity.title){
            const renderedBody = await this.renderMarkdown(body);
            this.parseHtml(renderedBody).traverse(node => {
                if(node.type == 'h1') entity.title = node.text;
            });
        }

        const { type = 'post', ...values } = entity;

        await this.database[this.inflector.pluralize(type)].insert(values);
    },

    extractFrontMatterAndBody(data){
        let frontMatter = {};
        let body = '';
        const matches = data.match(/^---+[\r\n]([\S\s]*?)[\r\n]---+([\S\s]*)$/)
        if(matches){
            frontMatter = Yaml.load(matches[1]);
            body = matches[2];
        } else {
            body = data;
        }
        return [ frontMatter, body ];
    }
};
