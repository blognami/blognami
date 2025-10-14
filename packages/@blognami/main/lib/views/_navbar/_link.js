export const styles = `
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
`;

export default {
    render(){
        const isActive = this.initialParams._url.pathname === this.params.url;
        const activeClass = isActive ? ` ${this.cssClasses.linkActive}` : '';
        
        return this.renderHtml`
            <a href="${this.params.url}" class="${this.cssClasses.link}${activeClass}" target="${this.params.target}">${this.params.label}</a>
        `;
    }
};