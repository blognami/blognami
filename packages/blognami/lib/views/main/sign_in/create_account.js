
import * as crypto from 'crypto';

export default {
    render(){
        const { name, email, title, redirectUrl } = this.params;
        
        const that = this;

        return this.renderForm(
            this.createModel({
                meta(){
                    this.mustNotBeBlank('password');
                    this.validateWith(async function(){
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
                            if(redirectUrl){
                                return that.renderHtml`
                                    <span data-component="a" data-href="${redirectUrl}">
                                        <script type="blognami">
                                            this.parent.trigger('click');
                                            
                                            const { document } = this;
                                            this.overlay.on('close', () => document.load());
                                        </script>
                                    </span>
                                `;
                            }
                            return that.renderHtml`
                                <span data-component="a" data-target="_top" data-trigger="click"></span>
                            `;
                        }}
                    `.toResponseArray();
            
                    headers['Set-Cookie'] = `blognamiSession=${session.id}:${passString}; Path=/`;
            
                    return [ status, headers, body ];
                }
            }
        );
    }
};