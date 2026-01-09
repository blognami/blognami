
import crypto from 'crypto';

export default {
    async render(){
        let user;

        if(await this.session){
            user = await this.session.user;
        }

        if(!user){
            return this.renderHtml`
                <span data-component="pinstripe-anchor" data-href="/_actions/guest/sign_in?title=${encodeURIComponent('Demo')}&returnUrl=${encodeURIComponent(`/_actions/guest/add_blog`)}">
                    <script type="pinstripe">
                        this.parent.trigger('click');
                    </script>
                </span>
            `;
        }

        const model = this.createModel({
            meta(){
                this.mustNotBeBlank('title');
            }
        });

        return this.renderForm(model, {
            title: 'Demo',
            fields: [{
                label: "Your blog's name",
                name: 'title',
                placeholder: 'e.g. My cool blog',
            }],
            width: 'small',
            submitTitle: 'Next',
            success: this.addPublication.bind(this)
        });
    },

    async addPublication({ title }){
        const user = await this.session.user;

        return await this.database.transaction(async () => {
            const nameBase = title.replace(/[^a-z0-9]/ig, ' ').trim().replace(/\s+/g, '-').toLowerCase();
            let candidateName = nameBase;
            let i = 2;
            while(await this.database.tenants.where({ name: candidateName }).first()){
                candidateName = `${nameBase}-${i}`;
                i++;
            }

            const tenant = await this.database.tenants.insert({
                name: candidateName
            });

            const userName = user.name;
            const userEmail = user.email;

            await tenant.runInNewWorkspace(async function(){
                await this.database.site.update({ title });

                await this.database.users.insert({
                    name: userName,
                    email: userEmail,
                    role: 'admin',
                });
            });

            const url = `/_actions/user/go_to_blog?id=${tenant.id}`;

            return this.renderHtml`
                <script>
                    window.location = ${this.renderHtml(JSON.stringify(url))};
                </script>
            `;
        });
    }
};
