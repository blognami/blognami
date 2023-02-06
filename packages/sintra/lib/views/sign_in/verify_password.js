
import * as crypto from 'crypto';

export default {
    render(){
        const { email } = this.params;
        
        const that = this;

        return this.renderForm(
            this.createModel({
                meta(){
                    this.mustNotBeBlank('password');
                    this.validateWith(async function(){
                        if(!this.isValidationError('password')){
                            const user = await that.database.users.where({ email }).first();
                            if(!user || !(await user.verifyPassword(this.password))){
                                this.setValidationError('general', `Either your email ("${email}") or password is incorrect.`);
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
                fields: [{ name: 'password', type: 'password', label: 'Your one-time-password', placeholder: 'Enter the one-time-password this has just been sent to you (via email).' }],
            
                async success(){
                    const user = await that.database.users.where({ email }).first();
                    await user.logSuccessfulSignIn();
                    const passString = crypto.randomUUID();
                    const session = await that.database.sessions.insert({
                        userId: user.id,
                        passString,
                        lastAccessedAt: Date.now()
                    });
                    
                    const [ status, headers, body ] = await that.renderHtml`
                        <span data-component="pinstripe-anchor" data-target="_top" data-trigger="click"></span>
                    `.toResponseArray();
            
                    headers['Set-Cookie'] = `sintraSession=${session.id}:${passString}; Path=/`;
            
                    return [ status, headers, body ];
                }
            }
        );
    }
};