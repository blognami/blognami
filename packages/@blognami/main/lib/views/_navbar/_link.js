export const styles = ({ colors }) => `
    .link {
        text-decoration: none;
        color: ${colors.gray[500]};
        font-weight: 500;
        transition: color 0.2s ease;
        padding: 0.8rem 0;
    }

    .link:hover {
        color: ${colors.gray[900]};
    }

    .link-active {
        color: ${colors.semantic.accent};
    }
`;

export default {
    render(){
        const { url, target, label, testId, preload } = this.params;

        const isActive = this.initialParams._url.pathname === url;
        const activeClass = isActive ? ` ${this.cssClasses.linkActive}` : '';

        return this.renderTag('a', {
            href: url,
            class: `${this.cssClasses.link}${activeClass}`,
            target: target,
            'data-test-id': testId,
            'data-preload': preload ? 'true' : null,
            body: label
        });
    }
};