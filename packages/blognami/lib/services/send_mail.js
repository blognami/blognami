
import { createTransport } from 'nodemailer';
import chalk from 'chalk';

export default {
    create(){
        return this.defer(async () => {
            const { mail: mailConfig = {} } = await this.config;
            const { adapter = 'dummy', ...adapterConfig } = mailConfig;
            if(adapter == 'dummy') return this.createDummy(adapterConfig);
            if(adapter == 'smtp') return this.createSmtp(adapterConfig);
            throw new Error(`No such mail adapter '${adapter}' exists.`);
        });
    },

    createDummy({ defaults }){
        return (mailOptions = {}) => {
            const { text, html, ...otherMailOptions } = { ...defaults, ...mailOptions };
            if(process.env.NODE_ENV == 'test') return;
            console.log('');
            console.log('----------------------------------------');
            console.log(chalk.green('sendMail'));
            console.log('----------------------------------------');
            Object.keys(otherMailOptions).forEach(name => {
                console.log(`${name}: ${JSON.stringify(otherMailOptions[name])}`)
            });
            if(text){
                console.log('text:')
                console.log(text.replace(/(^|\n)/g, '$1  '));
            }
            if(html){
                console.log('html:')
                console.log(html.replace(/(^|\n)/g, '$1  '));
            }
            if(!Object.keys(mailOptions).length){
                console.log('No mail options have been provided.')
            }
            console.log('----------------------------------------');
            console.log('');
        }
    },

    createSmtp({ defaults, ...config }){
        const transport = createTransport(config, defaults);
        return (mailOptions = {}) => transport.sendMail(mailOptions);
    }
};
