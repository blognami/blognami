export const styles = ({ colors, shadow, breakpointFor, remify }) => `
    .root {
        max-width: ${remify(1280)};
        margin: 0 auto;
        width: 100%;
        padding: ${remify(16)} ${remify(16)} 0;
        box-sizing: border-box;
    }

    .cover {
        display: block;
        width: 100%;
        height: ${remify(120)};
        object-fit: cover;
    }

    .identity {
        display: flex;
        align-items: flex-end;
        gap: ${remify(12)};
        padding: 0 ${remify(16)};
    }

    .logo {
        width: ${remify(72)};
        height: ${remify(72)};
        margin-top: ${remify(-36)};
        border-radius: 50%;
        object-fit: cover;
        border: ${remify(4)} solid ${colors.white};
        background-color: ${colors.white};
        box-shadow: ${shadow.md};
        flex-shrink: 0;
    }

    .title {
        margin: ${remify(10)} 0 0;
        font-size: ${remify(24)};
        line-height: 1.2;
        color: ${colors.gray[900]};
    }

    .description {
        margin: ${remify(4)} 0 0;
        font-size: ${remify(14)};
        line-height: 1.4;
        color: ${colors.gray[500]};
    }

    ${breakpointFor('md')} {
        .root {
            padding: ${remify(24)} ${remify(24)} 0;
        }

        .cover {
            height: ${remify(200)};
        }

        .description {
            font-size: ${remify(16)};
        }
    }
`;

export default {
    async render(){
        const site = await this.database.site;
        const coverImage = await site.coverImage;
        const { description } = site;
        if(!coverImage && !description) return;

        const logoImage = coverImage && await site.logoImage;

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${coverImage ? this.renderHtml`
                    <img class="${this.cssClasses.cover}" src="/${coverImage.slug}" alt="" data-test-id="cover-banner">
                ` : undefined}
                <div class="${this.cssClasses.identity}">
                    ${logoImage ? this.renderHtml`
                        <img class="${this.cssClasses.logo}" src="/${logoImage.slug}" alt="${site.title}" data-test-id="cover-logo">
                    ` : undefined}
                    <div>
                        <h1 class="${this.cssClasses.title}" data-test-id="cover-title">${site.title}</h1>
                        ${description ? this.renderHtml`
                            <p class="${this.cssClasses.description}" data-test-id="cover-description">${description}</p>
                        ` : undefined}
                    </div>
                </div>
            </div>
        `;
    }
};
