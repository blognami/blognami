export const styles = ({ colors, breakpointFor, remify }) => `
    .root {
        display: none;
    }

    .title {
        font-size: ${remify(14)};
        font-weight: 600;
        color: ${colors.gray[900]};
        margin-bottom: ${remify(12)};
    }

    .links {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .links .links {
        padding-left: ${remify(16)};
        margin-top: ${remify(4)};
        border-left: ${remify(1)} solid ${colors.gray[200]};
    }

    .link {
        display: block;
        text-decoration: none;
        color: ${colors.gray[500]};
        padding: ${remify(4)} 0;
        font-size: ${remify(12)};
        transition: color 0.2s ease;
    }

    .links .links .link {
        font-size: ${remify(11)};
        color: ${colors.gray[400]};
        padding: ${remify(3)} 0;
        position: relative;
    }

    .links .links .link::before {
        content: '';
        position: absolute;
        left: -${remify(16)};
        top: 50%;
        transform: translateY(-50%);
        width: ${remify(8)};
        height: ${remify(1)};
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
            width: ${remify(192)};
            padding: ${remify(32)} 0 ${remify(32)} 0;
            position: sticky;
            top: ${remify(64)};
            height: calc(100vh - ${remify(64)});
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