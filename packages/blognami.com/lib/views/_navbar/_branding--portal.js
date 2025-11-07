

export const styles = `
    .navbar-logo {
        max-height: 32px;
    }
`;

export default {
    render(){
        return this.renderHtml`
            <a href="/" data-test-id="title"><img src="/images/inline_logo.svg" alt="Blognami" class="${this.cssClasses.navbarLogo}" /></a>
        `
    }
};
