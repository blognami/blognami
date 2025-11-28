export const styles = ({ colors, breakpointFor }) => `
    .root {
        display: none;
    }

    .title {
        font-size: 1.4rem;
        font-weight: 600;
        color: ${colors.gray[900]};
        margin-bottom: 1.2rem;
    }

    .links {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .links .links {
        padding-left: 1.6rem;
        margin-top: 0.4rem;
        border-left: 1px solid ${colors.gray[200]};
    }

    .link {
        display: block;
        text-decoration: none;
        color: ${colors.gray[500]};
        padding: 0.4rem 0;
        font-size: 1.2rem;
        transition: color 0.2s ease;
    }

    .links .links .link {
        font-size: 1.1rem;
        color: ${colors.gray[400]};
        padding: 0.3rem 0;
        position: relative;
    }

    .links .links .link::before {
        content: '';
        position: absolute;
        left: -1.6rem;
        top: 50%;
        transform: translateY(-50%);
        width: 0.8rem;
        height: 1px;
        background-color: ${colors.gray[300]};
    }

    .link:hover {
        color: ${colors.gray[900]};
    }

    .links .links .link:hover {
        color: ${colors.gray[500]};
    }

    .link[data-active="true"] {
        color: ${colors.semantic.accent};
        font-weight: 500;
    }

    .links .links .link[data-active="true"] {
        color: ${colors.semantic.accent};
        font-weight: 500;
    }

    ${breakpointFor('lg')} {
        .root {
            display: block;
            width: 19.2rem;
            padding: 3.2rem 0 3.2rem 0;
            position: sticky;
            top: 6.4rem;
            height: calc(100vh - 6.4rem);
            overflow-y: auto;
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


        let scrollTopOffset = 0;
        const scrollTopElementId = this.document.head.find('meta[name="pinstripe-scroll-top-element-id"]')?.params.content || 'pinstripe-scroll-top';
        const scrollTopElement = this.document.find(`#${scrollTopElementId}`);
        if(scrollTopElement){
            scrollTopOffset = scrollTopElement.node.getBoundingClientRect().bottom + 10;
        }

        const handleScroll = () => {
            const scrollY = window.scrollY + scrollTopOffset;
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
                    ${this.renderLinks(links)}
                </ul>
            </aside>
        `;
    },

    renderLinks(links){
        return this.renderHtml`
            <ul class="${this.cssClasses.links}">
                ${links.map(({ title, id, links: subLinks }) => this.renderHtml`
                    <li>
                        <a href="#${id}" class="${this.cssClasses.link}">${title}</a>
                        ${subLinks ? this.renderLinks(subLinks) : ''}
                    </li>
                `)}
            </ul>
        `;
    }
};