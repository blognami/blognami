
import { promisify } from 'util';
import { readFile } from 'fs';

import { View } from '../view.js';

View.FileImporter.register('ejs', {
    importFile({ relativeFilePathWithoutExtension, filePath }){
        let compileTemplatePromise;

        View.register(relativeFilePathWithoutExtension, {
            async render(){
                if(!compileTemplatePromise){
                    compileTemplatePromise = await this.compileTemplate();
                }
                const template = await compileTemplatePromise;
                return template.call(this);
            },

            async compileTemplate(){
                let template = await promisify(readFile)(filePath, 'utf8');
                let line = 1;

                template = template.replace(/[\s\S]*?<%={0,1}[\s\S]*?%>|[\s\S]+/g, chunk => {
                    let out = '';

                    const matches = chunk.match(/^([\s\S]*?)(<%[=#]{0,1})([\s\S]*?)%>$/);
                    if(matches) {
                        if(matches[2] == '<%#'){
                            if (matches[1].length > 0){
                                out = `body.push(await __view__.renderHtml(${JSON.stringify(matches[1])}));`;
                            }
                        } else if (matches[2] == '<%='){
                            if(matches[1].length > 0){
                                out = `
                                    body.push(await __view__.renderHtml(${JSON.stringify(matches[1])}));
                                    ${compileBlock(line + countLines(matches[1]), `body.push(await __view__.renderHtml\`\${${matches[3]}}\`);`)}
                                `;
                            } else {
                                out = compileBlock(line, `body.push(await __view__.renderHtml\`\${${matches[3]}}\`);`);
                            }
                        } else {
                            if (matches[1].length > 0){
                                out = `
                                    body.push(await __view__.renderHtml(${JSON.stringify(matches[1])}));
                                    ${compileBlock(line + countLines(matches[1]), matches[3])}
                                `;
                            } else {
                                out =  compileBlock(line, matches[3]);
                            }
                        }
                    } else if (chunk.length > 0) {
                        out = `body.push(await __view__.renderHtml(${JSON.stringify(chunk)}));`;
                    }

                    line += countLines(chunk);

                    return out;
                });

                const AsyncFunction = (async function () {}).constructor;
                return new AsyncFunction(`
                    const __view__ = this;
                    const body = [];
                    
                    ${template}
                    return await __view__.renderHtml\`\${body}\`;`);
            }
        });
    }
});

const countLines = string => string.split(/\r\n|\r|\n/).length - 1;

const compileBlock = (line, code) => `
    try {
        ${code}
    } catch(e){
        const line = ${line};
        throw new Error(\`EJS error: line ${line}: \${e.message}\`);
    }
`;
