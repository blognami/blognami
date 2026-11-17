
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

import { Bundle, View } from 'blognami';

export default {
    create(){
        return {
            addModules: this.addModules.bind(this),
            checkFileExists: existsSync,
            emptyDir: this.emptyDir.bind(this),
            copyDir: this.copyDir.bind(this),
            copyFileBackedViews: this.copyFileBackedViews.bind(this)
        };
    },

    emptyDir(dirPath){
        rmSync(dirPath, { recursive: true, force: true });
        mkdirSync(dirPath, { recursive: true });
    },

    copyDir(fromPath, toPath){
        // Each file read and written as bytes: `cpSync` fails with EACCES on a Docker bind mount.
        for(const entry of readdirSync(fromPath, { recursive: true, withFileTypes: true })){
            if(!entry.isFile()) continue;
            const filePath = join(entry.parentPath, entry.name);
            const copyPath = join(toPath, relative(fromPath, filePath));
            mkdirSync(dirname(copyPath), { recursive: true });
            writeFileSync(copyPath, readFileSync(filePath));
        }
    },

    // The hand-over header a file-backed view answers with names the stored
    // file by its full view name, flag segments included.
    copyFileBackedViews(toPath){
        for(const name of View.names){
            const view = View.for(name);
            if(!view.isFileBacked) continue;
            const copyPath = join(toPath, name);
            mkdirSync(dirname(copyPath), { recursive: true });
            writeFileSync(copyPath, readFileSync(view.latestFilePath));
        }
    },

    async addModules(objectClass){
        const entryPath = fileURLToPath(new URL('../../worker/index.js', import.meta.url));

        Bundle.addModule('serviceWorker', `export { default, ${objectClass} } from ${JSON.stringify(entryPath)};`);

        const { name, rootPath, config: { version } } = await this.project;
        const projectConfigPath = `${rootPath}/blognami.config.js`;

        // A Durable Object has no project on disk, so what Project and the config service read there on Node is built in.
        Bundle.addModule('serviceWorker', `
            import { Project } from ${JSON.stringify(fileURLToPath(import.meta.resolve('blognami')))};
            ${existsSync(projectConfigPath) ? `import blognamiConfig from ${JSON.stringify(projectConfigPath)};` : 'const blognamiConfig = undefined;'}
            Project.include({
                initialize(){
                    this.config = ${JSON.stringify({ name, version })};
                    this.blognamiConfig = blognamiConfig;
                }
            });
        `);
    }
};
