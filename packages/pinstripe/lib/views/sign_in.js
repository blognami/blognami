
import * as crypto from 'crypto';

export default async ({ renderForm, database, renderHtml }) => renderForm({
    title: 'Sign In',
    fields: ['email', { name: 'password', type: 'password' }],
    model: {
        meta(){
            this.mustNotBeBlank('email')
            this.mustBeAValidEmail('email')
            this.mustNotBeBlank('password')
            this.validateWith(async function(){
                if(!this.isValidationError('email') && !this.isValidationError('password')){
                    const user = await database.users.emailEq(this.email).first();
                    if(!user || !(await user.comparePassword(this.password))){
                        this.setValidationError('general', 'Either your email or password is incorrect.');
                    }
                }
            })
        }
    },

    async success({ email }){
        const { id } = await database.users.emailEq(email).first();
        const passString = crypto.randomUUID();
        const session = await database.sessions.insert({
            userId: id,
            passString
        });
        
        const [ status, headers, body ] = await renderHtml`
            <span data-node-wrapper="anchor" data-target="_top" data-trigger="click"></span>
        `.toResponseArray();

        headers['Set-Cookie'] = `pinstripeSession=${session.id}:${passString}`;

        return [ status, headers, body ];
    }
});
