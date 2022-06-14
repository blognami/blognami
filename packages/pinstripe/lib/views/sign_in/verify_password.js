
import * as crypto from 'crypto';

export default ({ createModel, renderForm, users, params, renderHtml, sessions }) => renderForm(
    createModel({
        meta(){
            this.mustNotBeBlank('password');
            this.validateWith(async function(){
                if(!this.isValidationError('password')){
                    const user = await users.emailEq(params.email).first();
                    if(!user || !(await user.verifyPassword(this.password))){
                        this.setValidationError('general', `Either your email ("${params.email}") or password is incorrect.`);
                    }
                    if(user){
                        await user.logFailedSignIn();
                    }
                }
            });
        }
    }),
    {
    title: 'Sign In',
    fields: [{ name: 'password', type: 'password', label: 'Your one-time-password', placeholder: 'Enter the one-time-password that has just been sent to you (via email).' }],

    async success(){
        const user = await users.emailEq(params.email).first();
        await user.logSuccessfulSignIn();
        const passString = crypto.randomUUID();
        const session = await sessions.insert({
            userId: user.id,
            passString,
            lastAccessedAt: Date.now()
        });
        
        const [ status, headers, body ] = await renderHtml`
            <span data-node-wrapper="anchor" data-target="_top" data-trigger="click"></span>
        `.toResponseArray();

        headers['Set-Cookie'] = `pinstripeSession=${session.id}:${passString}; Path=/`;

        return [ status, headers, body ];
    }
});