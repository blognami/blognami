export const styles = `
    .root {
        width: 19.2rem;
        padding: 3.2rem 0 3.2rem 3.2rem;
        position: sticky;
        top: 6.4rem;
        height: calc(100vh - 6.4rem);
        overflow-y: auto;
    }

    .title {
        font-size: 1.4rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 1.2rem;
    }

    .links {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .link {
        display: block;
        text-decoration: none;
        color: #6b7280;
        padding: 0.4rem 0;
        font-size: 1.2rem;
        transition: color 0.2s ease;
    }

    .link:hover {
        color: #111827;
    }

    .link[data-active="true"] {
        color: #35D0AC;
    }

    @media (max-width: 1024px) {
        .root {
            display: none;
        }
    }
`;

export const decorators = {
    root(){
        const links = this.findAll('a[href^="#"]').map(link => {
            const id = link.attributes.href;
            const targetElement = this.document.find(id);

            if(!targetElement) return null;

            return {
                element: link,
                targetElement
            };
        }).filter(Boolean);

        const handleScroll = () => {
            const scrollY = window.scrollY;
            let nearestLink = null;
            let nearestDistance = Infinity;
            
            for(const link of links){
                const distance = Math.abs(scrollY - link.targetElement.node.offsetTop);
                if(distance < nearestDistance){
                    nearestDistance = distance;
                    nearestLink = link;
                }
            }

            for(const link of links){
                link.element.attributes['data-active'] = (link === nearestLink).toString();
            }
        }

        handleScroll();

        this.manage(this.document.on('scroll', handleScroll));
    }
};

export default {
    render(){
        const links = this.params.links || [];
        if(links.length === 0) return;

        return this.renderHtml`
            <aside class="${this.cssClasses.root}">
                <h4 class="${this.cssClasses.title}">On This Page</h4>
                <ul class="${this.cssClasses.links}">
                    ${links.map(({ title, id }, index) => this.renderHtml`
                        <li><a href="#${id}" class="${this.cssClasses.link}">${title}</a></li>
                    `)}
                </ul>
            </aside>
        `;
    }
};