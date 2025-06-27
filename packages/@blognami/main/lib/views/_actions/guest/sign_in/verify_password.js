
import * as crypto from 'crypto';

export default {
    render(){
        const { title = 'Sign In', returnUrl, email } = this.params;
        
        let optionalParams = '';
        if(title != 'Sign In'){
            optionalParams += `&title=${encodeURIComponent(title)}`;
        }
        if(returnUrl){
            optionalParams += `&returnUrl=${encodeURIComponent(returnUrl)}`;
        }
        
        const that = this;

        return this.renderForm(
            this.createModel({
                meta(){
                    this.mustNotBeBlank('password');
                    this.validateWith(async function(){
                        if(!this.isValidationError('password')){
                            const user = await that.database.users.where({ email }).first();
                            if((user && !await user.verifyPassword(this.password)) || (!user && !await that.database.site.verifyPassword(email, this.password))){
                                this.setValidationError('general', `Either your email ("${email}") or password is incorrect.`);
                                if(user) await user.logFailedSignIn();
                            }
                        }
                    });
                }
            }),
            {
                title,
                fields: [{ name: 'password', type: 'password', label: 'Your one-time-password', placeholder: 'Enter the one-time-password this has just been sent to you (via email).' }],
                submitTitle: 'Next',
                width: 'small',
                
                async success(){
                    const user = await that.database.users.where({ email }).first();
                    if(!user) return that.renderRedirect({ url: `/_actions/guest/sign_in/create_account?email=${encodeURIComponent(email)}&password=${encodeURIComponent(await that.database.site.generatePassword(email))}${optionalParams}`});
                    await user.logSuccessfulSignIn();
                    const passString = crypto.randomUUID();
                    const session = await that.database.sessions.insert({
                        userId: user.id,
                        passString,
                        lastAccessedAt: Date.now()
                    });
                    
                    const [ status, headers, body ] = await that.renderHtml`
                        ${() => {
                            if(returnUrl) return that.renderHtml`
                                ${that.renderRedirect({ url: returnUrl })}
                                <script type="pinstripe">
                                    const { document } = this;
                                    this.overlay.on('close', () => document.load());
                                </script>
                            `;
                            return that.renderRedirect({ target: '_top' });
                        }}
                    `.toResponseArray();
            
                    headers['Set-Cookie'] = `sintraSession=${session.id}:${passString}; Path=/`;
            
                    return [ status, headers, body ];
                }
            }
        );
    }
};