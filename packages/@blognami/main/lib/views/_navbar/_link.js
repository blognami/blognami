export const styles = ({ colors, remify }) => `
    .link {
        text-decoration: none;
        color: ${colors.gray[500]};
        font-weight: 500;
        transition: color 0.2s ease;
        padding: ${remify(8)} 0;
    }

    .link:hover {
        color: ${colors.gray[900]};
    }

    .link-active {
        color: ${colors.semantic.accent};
    }

    .link-primary {
        color: ${colors.white};
        background-color: ${colors.semantic.accent};
        padding: ${remify(9)} ${remify(20)};
        border-radius: ${remify(8)};
        font-weight: 600;
        transition: opacity 0.2s ease;
    }

    .link-primary:hover {
        color: ${colors.white};
        opacity: 0.9;
    }
`;

export default {
    render(){
        const { url, target, label, testId, preload, activeHighlight, isPrimary, primaryColor } = this.params;

        const isActive = activeHighlight !== false && this.initialParams._url.pathname === url;

        const classes = [this.cssClasses.link];
        if(isPrimary){
            classes.push(this.cssClasses.linkPrimary);
        } else if(isActive){
            classes.push(this.cssClasses.linkActive);
        }

        return this.renderTag('a', {
            href: url,
            class: classes.join(' '),
            style: isPrimary && primaryColor ? `background-color: ${primaryColor};` : null,
            target: target,
            'data-test-id': testId,
            'data-preload': preload ? 'true' : null,
            body: label
        });
    }
};