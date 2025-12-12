
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
            
            const { scopedDatabase, id } = await this.database.tenants.insert({
                name: candidateName
            });

            await scopedDatabase.site.update({ title });

            await scopedDatabase.users.insert({
                name: user.name,
                email: user.email,
                role: 'admin',
            });

            const url = `/_actions/user/go_to_blog?id=${id}`;

            return this.renderHtml`
                <script>
                    window.location = ${this.renderHtml(JSON.stringify(url))};
                </script>
            `;
        });
    }
};
