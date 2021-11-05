
import * as crypto from 'crypto';
import * as uuid from 'uuid';

if(!crypto.randomUUID){
    crypto.randomUUID = uuid.v4;
}

export default async ({ renderForm, database, renderScript }) => renderForm({
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
        
        const [ status, headers, body ] = await renderScript(() => this.document.load()).toResponseArray();

        headers['Set-Cookie'] = `pinstripeSession=${session.id}:${passString}`;

        return [ status, headers, body ];
    }
});
