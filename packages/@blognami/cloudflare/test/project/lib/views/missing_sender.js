// Sends with a blank `from`, which overrides `mail.defaults.from`, so the message has no sender.
const RECIPIENT = 'missing-sender@example.com';

export default {
    async render(){
        await this.sendMail({ to: RECIPIENT, from: '', subject: 'No sender', text: 'No sender' });
        return [200, { 'content-type': 'text/plain' }, []];
    }
};
