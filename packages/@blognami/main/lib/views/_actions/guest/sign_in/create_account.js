
import * as crypto from 'crypto';

export default {
    render(){
        const { name, email, title, returnUrl } = this.params;
        
        const that = this;

        return this.renderForm(
            this.createModel({
                meta(){
                    this.mustNotBeBlank('password');
                    this.on('validation', async function(){
                        if(!this.isValidationError('password') && !await that.database.site.verifyPassword(email, this.password)){
                            this.setValidationError('general', `Your password is incorrect.`);
                        }
                    });
                }
            }),
            {
                title,
                fields: [{ name: 'email', type: 'hidden' }, { name: 'password', type: 'hidden' }, { name: 'name', label: 'Your Name'}],
                submitTitle: 'Next',
                width: 'small',
                
                async success(){
                    const user = await that.database.users.insert({
                        name,
                        email,
                        role: 'user'
                    });
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
            
                    headers['Set-Cookie'] = `pinstripeSession=${session.id}:${passString}; Path=/`;
            
                    return [ status, headers, body ];
                }
            }
        );
    }
};