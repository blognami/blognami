export const styles = `
    .root {
        display: flex;
        align-items: center;
        gap: 3.2rem;
    }

    .links {
        display: flex;
        align-items: center;
        gap: 2.4rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .link {
        text-decoration: none;
        color: #6b7280;
        font-weight: 500;
        transition: color 0.2s ease;
        padding: 0.8rem 0;
    }

    .link:hover {
        color: #111827;
    }

    .link-active {
        color: #35D0AC;
    }

    .github-link {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        text-decoration: none;
        color: #6b7280;
        font-weight: 500;
        padding: 0.8rem 1.6rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.6rem;
        transition: all 0.2s ease;
    }

    .github-link:hover {
        color: #111827;
        border-color: #d1d5db;
    }

    @media (max-width: 768px) {
        .links {
            display: none;
        }
    }
`;

export default {
    render(){
        return this.renderHtml`
            <nav class="${this.cssClasses.root}">
                <ul class="${this.cssClasses.links}">
                    <li><a href="/" class="${this.cssClasses.link} ${this.cssClasses.linkActive}">Docs</a></li>
                    <li><a href="https://blognami.com/pinstripe" class="${this.cssClasses.link}">Blog</a></li>
                </ul>
                <a href="https://github.com/blognami/blognami" class="${this.cssClasses.githubLink}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                </a>
            </nav>
        `;
    }
};