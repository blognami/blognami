
export default {
    async render(){
        return this.renderForm(
            this.createModel({
                meta(){
                    this.mustNotBeBlank('email')
                    this.mustBeAValidEmail('email')
                }
            }),
            {
                title: 'Sign In',
                fields: [{ name: 'email', label: 'Your email', placeholder: "We'll send a one-time-password to this address." }],
                submitTitle: 'Next',
        
                success: async ({ email }) => {
                    const user = await this.database.users.where({ email }).first();
                    if(user){
                        const password = await user.generatePassword();
                        
                        this.runInNewWorkspace(({ sendMail }) => sendMail({ 
                            to: email,
                            subject: 'Your one-time-password',
                            text: `Your one-time-password: "${password}" - this will be valid for approximately 3 mins.`
                        }));
                    }
                    return this.renderHtml`
                        <span data-component="pinstripe-anchor" data-trigger="click" data-href="/sign_in/verify_password?email=${email}"></span>
                    `;
                }
            }
        );
    }
};