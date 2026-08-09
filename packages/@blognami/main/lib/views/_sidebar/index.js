
export const styles = ({ colors, breakpointFor, remify }) => `
    .root {
        display: none;
    }

    ${breakpointFor('md')} {
        .root {
            display: flex;
            width: ${remify(256)};
            padding: ${remify(32)} 0;
            border-right: ${remify(1)} solid ${colors.gray[200]};
            position: sticky;
            top: ${remify(64)};
            height: calc(100vh - ${remify(64)});
            overflow-y: auto;
            padding-right: ${remify(24)};
            flex-direction: column;
            gap: ${remify(4)};
        }
    }

    .filter-input {
        flex: none;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: ${remify(12)};
        padding: ${remify(8)} ${remify(12)};
        border: ${remify(1)} solid ${colors.gray[200]};
        border-radius: ${remify(8)};
        font-family: inherit;
        font-size: ${remify(13)};
        color: ${colors.gray[900]};
        background: ${colors.gray[50]};
    }

    .filter-input:focus {
        outline: none;
        border-color: ${colors.semantic.accent};
        background: ${colors.white};
    }

    .filter-input::placeholder {
        color: ${colors.gray[400]};
    }
`;

export const decorators = {
    root(){
        const { pathname } = this.document.url;
        this.findAll('a[href]').forEach(link => {
            if(link.attributes.href !== pathname) return;
            link.attributes['data-active'] = 'true';
            // Expand ancestors of the active link, but not the active link's own
            // branch — only links reached through a nested list count.
            let sawList = false;
            for(const ancestor of link.parents){
                if(ancestor.node === this.node) break;
                if(ancestor.is('ul')) sawList = true;
                if(sawList && ancestor.is('[data-collapsed]')){
                    ancestor.attributes['data-collapsed'] = 'false';
                    const toggle = ancestor.find('[aria-expanded]');
                    if(toggle) toggle.attributes['aria-expanded'] = 'true';
                }
            }
        });

        const applyFilter = value => {
            const query = `${value}`.trim().toLowerCase();
            this.attributes['data-filtering'] = query ? 'true' : 'false';
            const sections = this.findAll('div[data-collapsed]');
            const branches = this.findAll('li');
            if(!query){
                [...sections, ...branches].forEach(item => item.attributes['data-filter-hidden'] = 'false');
                return;
            }
            [...sections, ...branches].forEach(item => item.attributes['data-filter-hidden'] = 'true');
            this.findAll('[data-filter-label]').forEach(label => {
                if(!label.text.toLowerCase().includes(query)) return;
                const branch = label.parents.find(parent => parent.is('li'));
                if(!branch) return;
                // A match reveals its whole subtree and every ancestor up to the
                // sidebar root.
                [branch, ...branch.findAll('li')].forEach(item => item.attributes['data-filter-hidden'] = 'false');
                for(const ancestor of branch.parents){
                    if(ancestor.node === this.node) break;
                    if(ancestor.is('li') || ancestor.is('div[data-collapsed]')){
                        ancestor.attributes['data-filter-hidden'] = 'false';
                    }
                }
            });
        };

        this.on('input', '[data-test-id="sidebar-filter"]', event => applyFilter(event.target.value));

        // The input's value property survives soft-navigation repatches while the
        // filter attributes don't — reapply so the tree matches the input.
        const filterInput = this.find('[data-test-id="sidebar-filter"]');
        if(filterInput && filterInput.value) applyFilter(filterInput.value);
    }
};

export default {
    async render(){
        const sections = await this.menus.content || [];

        return this.renderHtml`
            <aside class="${this.cssClasses.root}" data-test-id="sidebar">
                <input type="search" class="${this.cssClasses.filterInput}" placeholder="Filter…" aria-label="Filter navigation" data-test-id="sidebar-filter" autocomplete="off">
                ${this.renderView('_sidebar/_top_section')}
                ${sections.map(section =>
                    this.renderView('_sidebar/_link_group_section', section)
                )}
            </aside>
        `;
    }
};
