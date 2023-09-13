
export default {
    async render(){
        const { title = 'Sign In', redirectUrl } = this.params;
        
        let optionalParams = '';
        if(title != 'Sign In'){
            optionalParams += `&title=${encodeURIComponent(title)}`;
        }
        if(redirectUrl){
            optionalParams += `&redirectUrl=${encodeURIComponent(redirectUrl)}`;
        }

        return this.renderForm(
            this.createModel({
                meta(){
                    this.mustNotBeBlank('email')
                    this.mustBeAValidEmail('email')
                }
            }),
            {
                title,
                fields: [{ name: 'email', label: 'Your email', placeholder: "We'll send a one-time-password to this address." }],
                submitTitle: 'Next',
        
                success: async ({ email }) => {
                    const user = await this.database.users.where({ email }).first();

                    let password;
                    if(user){
                        password = await user.generatePassword();
                    } else {
                        password = await this.database.site.generatePassword(email);
                    }

                    this.runInNewWorkspace(({ sendMail }) => sendMail({ 
                        to: email,
                        subject: 'Your one-time-password',
                        text: `Your one-time-password: "${password}" - this will be valid for approximately 3 mins.`
                    }));

                    return this.renderHtml`
                        <span data-component="a" data-href="/sign_in/verify_password?email=${encodeURIComponent(email)}${optionalParams}"><script type="blognami">this.parent.trigger('click');</script></span>
                    `;
                }
            }
        );
    }
};