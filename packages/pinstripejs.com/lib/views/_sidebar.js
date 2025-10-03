export const styles = `
    .sidebar {
        width: 25.6rem;
        padding: 3.2rem 0;
        border-right: 1px solid #e5e7eb;
        position: sticky;
        top: 6.4rem;
        height: calc(100vh - 6.4rem);
        overflow-y: auto;
        padding-right: 2.4rem;
    }

    .sidebar-section {
        margin-bottom: 3.2rem;
    }

    .sidebar-title {
        font-size: 1.4rem;
        font-weight: 600;
        color: #111827;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1.2rem;
    }

    .sidebar-links {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .sidebar-link {
        display: block;
        text-decoration: none;
        color: #6b7280;
        padding: 0.6rem 0;
        font-size: 1.4rem;
        transition: color 0.2s ease;
        border-left: 2px solid transparent;
        padding-left: 1.2rem;
        margin-left: -1.2rem;
    }

    .sidebar-link:hover {
        color: #111827;
    }

    .sidebar-link-active {
        color: #35D0AC;
        border-left-color: #35D0AC;
        background-color: rgba(53, 208, 172, 0.05);
    }

    @media (max-width: 768px) {
        .sidebar {
            display: none;
        }
    }
`;

export default {
    render(){
        return this.renderHtml`
            <aside class="${this.cssClasses.sidebar}">
                <div class="${this.cssClasses.sidebarSection}">
                    <h3 class="${this.cssClasses.sidebarTitle}">Getting Started</h3>
                    <ul class="${this.cssClasses.sidebarLinks}">
                        <li><a href="/docs/installation" class="${this.cssClasses.sidebarLink} ${this.cssClasses.sidebarLinkActive}">Installation</a></li>
                        <li><a href="/docs/quick-start" class="${this.cssClasses.sidebarLink}">Quick Start</a></li>
                        <li><a href="/docs/project-structure" class="${this.cssClasses.sidebarLink}">Project Structure</a></li>
                    </ul>
                </div>
                <div class="${this.cssClasses.sidebarSection}">
                    <h3 class="${this.cssClasses.sidebarTitle}">Core Concepts</h3>
                    <ul class="${this.cssClasses.sidebarLinks}">
                        <li><a href="/docs/routing" class="${this.cssClasses.sidebarLink}">Routing</a></li>
                        <li><a href="/docs/views" class="${this.cssClasses.sidebarLink}">Views</a></li>
                        <li><a href="/docs/models" class="${this.cssClasses.sidebarLink}">Models</a></li>
                        <li><a href="/docs/controllers" class="${this.cssClasses.sidebarLink}">Controllers</a></li>
                    </ul>
                </div>
                <div class="${this.cssClasses.sidebarSection}">
                    <h3 class="${this.cssClasses.sidebarTitle}">Advanced</h3>
                    <ul class="${this.cssClasses.sidebarLinks}">
                        <li><a href="/docs/configuration" class="${this.cssClasses.sidebarLink}">Configuration</a></li>
                        <li><a href="/docs/deployment" class="${this.cssClasses.sidebarLink}">Deployment</a></li>
                        <li><a href="/docs/plugins" class="${this.cssClasses.sidebarLink}">Plugins</a></li>
                    </ul>
                </div>
            </aside>
        `;
    }
};