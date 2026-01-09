
import { readdir, readFile, stat, existsSync } from 'fs';
import { promisify } from 'util';
import Yaml from 'js-yaml';

export default {
    async run(){
        if(process.env.TENANCY === 'multi'){
            const lorumIpsumTenant = await this.database.tenants.insert({
                name: 'lorum-ipsum',
                subscriptionTier: 'demo',
                subscriptionExpiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
            });

            const portalTenant = await this.database.tenants.insert({
                name: 'portal',
                subscriptionTier: 'permanent'
            });

            if(process.env.SKIP_FIXTURES == 'true') return;

            await portalTenant.runInNewWorkspace(async function(){
                await this.database.users.insert({
                    name: 'Admin',
                    email: 'admin@example.com',
                    role: 'admin'
                });
            });

            const { rootPath } = await this.project;
            const contentPath = `${rootPath}/content`;
            const contentExists = existsSync(contentPath);

            await lorumIpsumTenant.runInNewWorkspace(async function(){
                await this.database.site.update({
                    title: 'Lorem ipsum',
                    navigation: [
                        'Provident itaque iste.',
                        '  * [Osinski Extensions](/osinski-extensions)'
                    ].join('\n')
                });

                const user = await this.database.users.insert({
                    name: 'Admin',
                    email: 'admin@example.com',
                    role: 'admin'
                });

                if(!contentExists) return;
                await loadDir.call(this, user.id, contentPath, contentPath);
            });
        } else {
            if(process.env.SKIP_FIXTURES == 'true') return;

            await this.database.site.update({
                title: 'Lorem ipsum',
                navigation: [
                    'Provident itaque iste.',
                    '  * [Osinski Extensions](/osinski-extensions)'
                ].join('\n')
            });

            const user = await this.database.users.insert({
                name: 'Admin',
                email: 'admin@example.com',
                role: 'admin'
            });

            const { rootPath } = await this.project;
            const contentPath = `${rootPath}/content`;
            if(!existsSync(contentPath)) return;
            await loadDir.call(this, user.id, contentPath, contentPath);
        }
    }
};

async function loadDir(userId, dirPath, currentDirPath){
    const items = (await promisify(readdir)(currentDirPath)).reverse();
    for(let i in items){
        const item = items[i];
        const currentPath = `${currentDirPath}/${item}`;
        const stats = await promisify(stat)(currentPath);
        if(stats.isDirectory()){
            await loadDir.call(this, userId, dirPath, currentPath);
        } else {
            await loadFile.call(this, userId, currentPath);
        }
    }
}

async function loadFile(userId, filePath){
    if(filePath.match(/\.md$/i)){
        await loadMarkdownFile.call(this, userId, filePath);
    }
}

async function loadMarkdownFile(userId, filePath){
    const data = await promisify(readFile)(filePath, 'utf8');
    const [ frontMatter, body ] = extractFrontMatterAndBody(data);
    const { type = 'post', tags, ...otherFrontMatter } = frontMatter;

    const tagIds = [];
    if(tags){
        for(let tagName of tags){
            const tag = await this.database.tags.where({ name: tagName }).first();
            if(tag){
                tagIds.push(tag.id);
                continue;
            }
            const { id } = await this.database.tags.insert({ name: tagName });
            tagIds.push(id);
        }
    }

    const entity = {
        userId,
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

    const { id } = await this.database[this.inflector.pluralize(type)].insert(entity);

    for(let tagId of tagIds){
        await this.database.tagableTags.insert({ tagableId: id, tagId });
    }
}

function extractFrontMatterAndBody(data){
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
