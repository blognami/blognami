
import { createTransport } from 'nodemailer';
import chalk from 'chalk';

export default {
    create(){
        return this.defer(async () => {
            const { mail: mailConfig = {} } = await this.config;
            const transport = createTransport(mailConfig);
            return (mailOptions = {}) => {
                if(process.env.NODE_ENV == 'production') return transport.sendMail(mailOptions);
                const { text, html, ...otherMailOptions } = mailOptions;
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
        });
    }
};
