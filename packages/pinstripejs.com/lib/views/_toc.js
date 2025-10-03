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

    .link-active {
        color: #35D0AC;
    }

    @media (max-width: 1024px) {
        .root {
            display: none;
        }
    }
`;

export default {
    render(){
        return this.renderHtml`
            <aside class="${this.cssClasses.root}">
                <h4 class="${this.cssClasses.title}">On This Page</h4>
                <ul class="${this.cssClasses.links}">
                    <li><a href="#quick-start" class="${this.cssClasses.link} ${this.cssClasses.linkActive}">Quick Start</a></li>
                    <li><a href="#features" class="${this.cssClasses.link}">Features</a></li>
                </ul>
            </aside>
        `;
    }
};