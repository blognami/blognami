
export default async ({ createModel, renderForm, users, sendMail, renderHtml }) => renderForm(
    createModel({
        meta(){
            this.mustNotBeBlank('email')
            this.mustBeAValidEmail('email')
        }
    }),
    {
        title: 'Sign In',
        fields: [{name: 'email', label: 'Your email', placeholder: "We'll send a one-time-password to this address."}],
        submitTitle: 'Next',

        async success({ email }){
            const user = await users.emailEq(email).first();
            if(user){
                const password = await user.generatePassword();
                await sendMail({ 
                    to: email,
                    subject: 'Your one-time-password',
                    text: `Your one-time-password: "${password}" - this will be valid for approximately 3 mins.`});
            }
            return renderHtml`
                <span data-node-wrapper="anchor" data-trigger="click" data-href="/sign_in/verify_password?email=${email}"></span>
            `;
        }
    }
);