
export default {
    async run(){
        const name = this.inflector.dasherize(this.params.name || '');
        if(name == ''){
            console.error('An extension --name must be given.');
            process.exit();
        }

        const projectConfig = await this.project.config;

        if(typeof projectConfig.exports != 'object') projectConfig.exports = {};

        const extensionDirPath = `lib/extensions/${name}`;

        projectConfig.exports[`./${name}`] = `./${extensionDirPath}/index.js`;

        const { inProjectRootDir, generateFile, line, echo } = this.fsBuilder;
    
        await inProjectRootDir(async () => {

            await generateFile(`package.json`, () => {
                echo(JSON.stringify(projectConfig, null, 2));
            });
    

            await generateFile(`lib/extensions/_file_importer.js`, { skipIfExists: true }, () => {
                line(`export default undefined;`);
            });

            await generateFile(`${extensionDirPath}/index.js`, { skipIfExists: true }, () => {
                line(`import { importAll } from 'pinstripe';`);
                line();
                line(`importAll(import.meta.url);`);
                line();
            });

        });        
    }
};
