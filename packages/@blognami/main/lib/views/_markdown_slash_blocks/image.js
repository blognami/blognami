export const styles = ({ colors, shadow, remify }) => `
    .image-block {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: ${remify(12)};
        padding: ${remify(20)} ${remify(28)};
        background: ${colors.white};
        border: ${remify(1)} solid ${colors.gray[200]};
        border-radius: ${remify(10)};
        box-shadow: ${shadow.lg};
        font-family: system-ui, -apple-system, sans-serif;
    }
    .image-block svg {
        width: ${remify(32)};
        height: ${remify(32)};
        color: ${colors.gray[400]};
    }
    .image-block button {
        border: ${remify(1)} solid ${colors.gray[300]};
        border-radius: ${remify(6)};
        background: ${colors.white};
        padding: ${remify(6)} ${remify(14)};
        font-size: ${remify(13)};
        font-weight: 500;
        color: ${colors.gray[800]};
        cursor: pointer;
        box-shadow: ${shadow.xs};
        transition: background 0.12s ease, border-color 0.12s ease;
    }
    .image-block button:hover {
        background: ${colors.gray[100]};
        border-color: ${colors.gray[400]};
    }
    .image-block button:active {
        transform: translateY(${remify(1)});
    }
`;

export default {
    async render(){
        return this.renderHtml`
            <div class="${this.cssClasses.imageBlock}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <path d="M21 15l-5-5L5 21"></path>
                </svg>
                <button data-component="pinstripe-anchor" data-href="/_actions/admin/add_image" data-target="_overlay">Add Image</button>
            </div>
        `;
    }
};