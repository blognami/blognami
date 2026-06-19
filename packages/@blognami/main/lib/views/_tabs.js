
export const styles = ({ colors, remify }) => `
    .root:not(:first-child){ margin-top: 2em; }

    .tab-bar {
        display: flex;
        gap: ${remify(4)};
        border-bottom: ${remify(1)} solid ${colors.gray[200]};
        margin-bottom: ${remify(20)};
    }

    .tab {
        padding: ${remify(6)} ${remify(12)};
        background: none;
        border: none;
        font: inherit;
        cursor: pointer;
        color: ${colors.gray[500]};
        border-bottom: ${remify(2)} solid transparent;
        margin-bottom: ${remify(-1)};
    }

    .tab[data-active="true"] {
        color: ${colors.gray[900]};
        font-weight: 600;
        border-bottom-color: ${colors.semantic.accent};
    }

    .pane { display: none; }
    .pane[data-active="true"] { display: block; }
`;

export const decorators = {
    root(){
        const tabs = this.findAll('[data-tab]');
        const panes = this.findAll('[data-pane]');
        tabs.forEach(tab => {
            tab.on('click', () => {
                tabs.forEach(t => t.attributes['data-active'] = (t === tab).toString());
                panes.forEach(p => p.attributes['data-active'] = (p.attributes['data-pane'] === tab.attributes['data-tab']).toString());
            });
        });
    }
};

export default {
    render(){
        const { tabs } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <div class="${this.cssClasses.tabBar}">
                    ${tabs.map(({ title, testId }, i) => this.renderHtml`
                        <button type="button" class="${this.cssClasses.tab}" data-tab="${i}" data-active="${i == 0 ? 'true' : 'false'}" ${testId ? this.renderHtml`data-test-id="${testId}"` : ''}>${title}</button>
                    `)}
                </div>
                ${tabs.map(({ body }, i) => this.renderHtml`
                    <div class="${this.cssClasses.pane}" data-pane="${i}" data-active="${i == 0 ? 'true' : 'false'}">${body}</div>
                `)}
            </div>
        `;
    }
};
