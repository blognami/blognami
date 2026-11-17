const sendMail = { // blognami-if(server,service-worker): export default {
    create(){
        return async (mailOptions = {}) => {
            const { mail = {} } = await this.config;
            const { to, from, subject, text, html } = {
                ...await this.normalizeMailOptions(mail.defaults),
                ...await this.normalizeMailOptions(mailOptions)
            };

            // The binding rejects a message with no sender with a TypeError that names nothing.
            if(!from) throw new Error('No sender: set `mail.defaults.from` in the config to send mail on Cloudflare.');

            const message = { to, from, subject };
            if(text) message.text = text;
            if(html) message.html = html;

            return this.initialParams._cloudflare.EMAIL.send(message);
        };
    }
};

// A Node process imports this package for its command, and its mail stays the engine's dummy or smtp.
export default {}; // blognami-if(server,service-worker): // kept out: the binding's sender above is the export
