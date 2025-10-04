
export const styles = `
    .root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }













    @media (max-width: 768px) {

        

        

    }
`;

export default {
    render(){
        return this.renderView('_pinstripe/_shell', {
            body: this.renderHtml`
                <div class="${this.cssClasses.root}">
                    ${this.renderView('_header')}

                    ${this.renderView('_main', { body: this.params.body })}

                    ${this.renderView('_footer')}
                </div>
            `
        });
    }
};
