
import { readdir, readFile, stat, existsSync } from 'fs'; 
import { promisify } from 'util';
import Yaml from 'js-yaml';

export default {
    async run(){
        let lorumIpsumScopedDatabase = this.database;
        
        if(process.env.TENANCY === 'multi'){
            lorumIpsumScopedDatabase = await this.database.tenants.insert({
                name: 'lorum-ipsum',
                subscriptionTier: 'demo',
                subscriptionExpiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
            }).scopedDatabase;

            const { scopedDatabase: portalScopedDatabase } =  await this.database.tenants.insert({
                name: 'portal',
                subscriptionTier: 'permanent'
            });

            if(process.env.SKIP_FIXTURES == 'true') return;
            
            await portalScopedDatabase.users.insert({
                name: 'Admin',
                email: 'admin@example.com',
                role: 'admin'
            });
        }
    
        if(process.env.SKIP_FIXTURES == 'true') return;
    
        await lorumIpsumScopedDatabase.site.update({
            title: 'Lorem ipsum',
            navigation: [
                'Provident itaque iste.',
                '  * [Osinski Extensions](/osinski-extensions)'
            ].join('\n')
        });
    
        this.user = await lorumIpsumScopedDatabase.users.insert({
            name: 'Admin',
            email: 'admin@example.com',
            role: 'admin'
        });

        const { rootPath } = await this.project;
        const contentPath = `${rootPath}/content`;
        if(!existsSync(contentPath)) return;
        await this.loadDir(lorumIpsumScopedDatabase, contentPath, contentPath);
    },

    async loadDir(scopedDatabase, dirPath, currentDirPath){
        const items = (await promisify(readdir)(currentDirPath)).reverse();
        for(let i in items){
            const item = items[i];
            const currentPath = `${currentDirPath}/${item}`;
            const stats = await promisify(stat)(currentPath);
            if(stats.isDirectory()){
                await this.loadDir(scopedDatabase, dirPath, currentPath);         
            } else {
                await this.loadFile(scopedDatabase, currentPath);
            }
        }
    },

    async loadFile(scopedDatabase, filePath){
        if(filePath.match(/\.md$/i)){
            await this.loadMarkdownFile(scopedDatabase, filePath);
        }
    },

    async loadMarkdownFile(scopedDatabase, filePath){
        const data = await promisify(readFile)(filePath, 'utf8');
        const [ frontMatter, body ] = this.extractFrontMatterAndBody(data);
        const { type = 'post', tags, ...otherFrontMatter } = frontMatter;

        const tagIds = [];
        if(tags){
            for(let tagName of tags){
                const tag = await scopedDatabase.tags.where({ name: tagName }).first();
                if(tag){
                    tagIds.push(tag.id);
                    continue;
                }
                const { id } = await scopedDatabase.tags.insert({ name: tagName });
                tagIds.push(id);
            }
        }

        const entity = {
            userId: this.user.id,
            ...otherFrontMatter,
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

        const { id } = await scopedDatabase[this.inflector.pluralize(type)].insert(entity);
        
        for(let tagId of tagIds){
            await scopedDatabase.tagableTags.insert({ tagableId: id, tagId });
        }
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

        body = body.replace(/^\s+|\s+$/g, '');

        return [ frontMatter, body ];
    }
};
