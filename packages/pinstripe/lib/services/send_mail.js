
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

    async createDummy({ defaults }){
        const normalizedDefaults = await this.normalizeMailOptions(defaults);
        return async (mailOptions = {}) => {
            const normalizedMailOptions = await this.normalizeMailOptions(mailOptions);
            const { text, html, ...otherMailOptions } = { ...normalizedDefaults, ...normalizedMailOptions };
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

    async createSmtp({ defaults, ...config }){
        const normalizedDefaults = await this.normalizeMailOptions(defaults);
        const transport = createTransport(config, normalizedDefaults);
        return async (mailOptions = {}) => transport.sendMail( await this.normalizeMailOptions(mailOptions));
    },

    async normalizeMailOptions(mailOptions = {}){
        let { text, html, ...out } = mailOptions;

        if(typeof text == 'function') text = await this.renderText(text);
        text = await text;
        if(text) out.text = text.toString();

        if(typeof html == 'function') html = await this.renderText(html);
        html = await html;
        if(html) out.html = html.toString();

        return out;
    }
};
