
export const styles = `
    .aboutContent {
        color: #4b5563;
        font-size: 1.4rem;
        line-height: 1.6;
        margin: 0;
    }

    .aboutContent p {
        margin: 0 0 1.6rem 0;
    }

    .aboutContent p:last-child {
        margin-bottom: 0;
    }

    .aboutContent a {
        color: #3b82f6;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    .aboutContent a:hover {
        color: #1d4ed8;
        text-decoration: underline;
    }
`;

export default {
    async render(){    
        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const isAdmin = user?.role == 'admin';
    
        const site = await this.database.site;

        return this.renderView('_navbar/burger_menu/_section', {
            label: 'About',
            testId: 'about-section',
            body: async () => {
                const content = this.renderMarkdown(await site.description);
                const wrappedContent = this.renderHtml`<div class="${this.cssClasses.aboutContent}">${content}</div>`;
                
                if(isAdmin) return this.renderView('_editable_area', {
                    url: "/_actions/admin/edit_site_description",
                    body: wrappedContent
                });
                return wrappedContent;
            }
        });
    }
};
