

export const styles = `
    .root {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .title {
        color: #000;
        text-align: center;
        font-family: Inter;
        font-size: 87.547px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-bottom: 127px;
    }

    .title > em {
        font-style: normal;
        background-image: linear-gradient(135deg, #6fbe53, #53bea7);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 281px;
        height: 85px;
        flex-shrink: 0;
        border-radius: 7px;
        background: #70BE54;
        color: #FFF;
        text-align: center;
        font-family: Inter;
        font-size: 28px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
`;

export default {
    render(){
        const { title, button, href } = this.params;
        return this.renderHtml`            
            <div class="${this.cssClasses.root}">
                <h1 class="${this.cssClasses.title}">${title}</h1>
                <a class="${this.cssClasses.button}" href="${href}">${button}</a>
            </div>
        `;
    }
}