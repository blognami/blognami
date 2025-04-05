
export default {
    async render(){
        const { title = 'Sign In', returnUrl } = this.params;
        
        let optionalParams = '';
        if(title != 'Sign In'){
            optionalParams += `&title=${encodeURIComponent(title)}`;
        }
        if(returnUrl){
            optionalParams += `&returnUrl=${encodeURIComponent(returnUrl)}`;
        }

        return this.renderForm(
            this.createModel({
                meta(){
                    this.mustNotBeBlank('email');
                    this.mustBeAValidEmail('email');
                    this.validateWith(function(){
                        if(!this.isValidationError('legal') && this.legal != 'true') {
                            this.setValidationError('legal', 'You must agree to the terms of service and aknowledge you have read the privacy and cookie policies.');
                        }
                    });
                }
            }),
            {
                title,
                fields: [
                    { name: 'email', label: 'Your email', placeholder: "We'll send a one-time-password to this address." },
                    { name: 'legal', type: 'checkbox', label: this.renderHtml`I agree to the <a href="/_legal/terms-of-service" target="_blank">terms of service</a>, and acknowledge I have read the <a href="/_legal/privacy-policy" target="_blank">privacy policy</a> and <a href="/_legal/cookie-policy" target="_blank">cookie policy</a>.` }
                ],
                submitTitle: 'Next',
                requiresProofOfWork: true,
                width: 'small',
        
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
                        text({ line }){
                            line(`Your one-time-password: "${password}" - this will be valid for approximately 3 mins.`);
                        }
                    }));

                    return this.renderHtml`
                        <span data-component="pinstripe-anchor" data-href="/_actions/guest/sign_in/verify_password?email=${encodeURIComponent(email)}${optionalParams}"><script type="pinstripe">this.parent.trigger('click');</script></span>
                    `;
                },
            }
        );
    }
};