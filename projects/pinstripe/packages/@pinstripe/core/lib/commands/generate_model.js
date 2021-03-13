
import { command } from '../command.js';
import { Inflector } from '../inflector.js';

command('generate-model', async ({
    cliUtils: { extractArg, extractFields, extractOptions },
    fsBuilder: { generateFile, line, indent }
}) => {
    const name = extractArg();
    if(!name){
        console.error(`Please give a name.`);
        return;
    }
    const fields = extractFields();
    const { abstract } = extractOptions({
        abstract: false
    });

    await generateFile(`lib/models/_importer.js`, { skipIfExists: true }, () => {
        line();
        line(`export { modelImporter as default } from 'pinstripe';`);
        line();
    });

    await generateFile(`lib/models/${Inflector.snakeify(name)}.js`, () => {
        line();
        if(abstract){
            line(`export const abstract = true;`);
            line();
        }
        line(`export default async (dsl) => (dsl`);
        indent(() => {
            fields.forEach(({ mandatory, name }) => {
                if(mandatory){
                    line(`.mustNotBeBlank('${name}')`);
                } else {
                    line(`// .mustNotBeBlank('${name}')`);
                }
            });
        })
        line(');');
        line();
    });
})
