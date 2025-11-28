

export const styles = ({ remify }) => `
    .navbar-logo {
        max-height: ${remify(32)};
    }
`;

export default {
    render(){
        return this.renderHtml`
            <a href="/" data-test-id="title"><img src="/images/inline_logo.svg" alt="Blognami" class="${this.cssClasses.navbarLogo}" /></a>
        `
    }
};
