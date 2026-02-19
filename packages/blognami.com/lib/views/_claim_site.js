
export const styles = ({ colors, remify, shadow }) => `
    .root {
        padding: ${remify(24)};
        max-width: ${remify(480)};
        margin: 0 auto;
    }

    .description {
        font-size: ${remify(14)};
        color: ${colors.gray[600]};
        margin-bottom: ${remify(20)};
        line-height: 1.5;
    }

    .input-group {
        display: flex;
        align-items: center;
        margin-bottom: ${remify(8)};
    }

    .input {
        flex: 1;
        height: ${remify(40)};
        padding: 0 ${remify(12)};
        font-size: ${remify(14)};
        border: ${remify(1)} solid ${colors.gray[300]};
        border-radius: ${remify(6)} 0 0 ${remify(6)};
        outline: none;
        transition: border-color 0.2s;
    }

    .input:focus {
        border-color: ${colors.lime[500]};
        box-shadow: 0 0 0 ${remify(3)} color-mix(in oklch, ${colors.lime[500]} 15%, transparent);
    }

    .input.is-error {
        border-color: ${colors.red[500]};
    }

    .input.is-available {
        border-color: ${colors.lime[500]};
    }

    .suffix {
        height: ${remify(40)};
        padding: 0 ${remify(12)};
        font-size: ${remify(14)};
        background: ${colors.gray[100]};
        border: ${remify(1)} solid ${colors.gray[300]};
        border-left: none;
        border-radius: 0 ${remify(6)} ${remify(6)} 0;
        display: flex;
        align-items: center;
        color: ${colors.gray[500]};
        white-space: nowrap;
    }

    .status {
        min-height: ${remify(24)};
        margin-bottom: ${remify(12)};
    }

    .error-text {
        font-size: ${remify(13)};
        color: ${colors.red[600]};
        margin: 0;
    }

    .available-text {
        font-size: ${remify(13)};
        color: ${colors.lime[600]};
        font-weight: 500;
        margin: 0;
    }

    .suggestions {
        margin-bottom: ${remify(16)};
    }

    .suggestions-label {
        font-size: ${remify(13)};
        color: ${colors.gray[600]};
        margin-bottom: ${remify(8)};
    }

    .suggestion-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: ${remify(8)};
    }

    .suggestion {
        font-size: ${remify(13)};
        padding: ${remify(4)} ${remify(12)};
        background: ${colors.gray[50]};
        border: ${remify(1)} solid ${colors.gray[200]};
        border-radius: ${remify(4)};
        cursor: pointer;
        transition: all 0.15s;
    }

    .suggestion:hover {
        background: ${colors.lime[50]};
        border-color: ${colors.lime[300]};
        color: ${colors.lime[700]};
    }

    .footer {
        display: flex;
        justify-content: flex-end;
        gap: ${remify(8)};
        padding-top: ${remify(16)};
        border-top: ${remify(1)} solid ${colors.gray[200]};
    }
`;

export const decorators = {
    claimForm(){
        const input = this.find('[data-subdomain-input]');
        const statusEl = this.find('[data-status]');
        const suggestionsEl = this.find('[data-suggestions]');
        const claimButton = this.find('[data-claim-button]');

        let debounceTimer;
        let lastCheckedSlug = '';
        let isAvailable = false;

        const updateStatus = (html) => {
            statusEl.patch(html);
        };

        const updateSuggestions = (suggestions) => {
            if(!suggestions || suggestions.length === 0){
                suggestionsEl.node.style.display = 'none';
                return;
            }
            suggestionsEl.node.style.display = 'block';
            const list = suggestionsEl.find('[data-suggestion-list]');
            list.patch(suggestions.map(s => `<li class="${suggestionsEl.params.suggestionClass}" data-suggestion="${s}">${s}</li>`).join(''));
        };

        const checkAvailability = async (slug) => {
            if(!slug || slug.length < 1) {
                updateStatus('');
                updateSuggestions([]);
                isAvailable = false;
                claimButton.node.disabled = true;
                input.node.className = input.node.className.replace(/\bis-error\b|\bis-available\b/g, '').trim();
                return;
            }

            const response = await fetch(`/_actions/admin/check_subdomain_availability?slug=${encodeURIComponent(slug)}`);
            const data = await response.json();

            if(input.node.value.trim().toLowerCase() !== slug) return;
            lastCheckedSlug = slug;

            if(data.available){
                isAvailable = true;
                claimButton.node.disabled = false;
                input.node.className = input.node.className.replace(/\bis-error\b/g, '').trim();
                if(!input.node.className.includes('is-available')) input.node.className += ' is-available';
                updateStatus(`<p class="${statusEl.params.availableClass}">&#10003; This subdomain is available!</p>`);
                updateSuggestions([]);
            } else {
                isAvailable = false;
                claimButton.node.disabled = true;
                input.node.className = input.node.className.replace(/\bis-available\b/g, '').trim();
                if(!input.node.className.includes('is-error')) input.node.className += ' is-error';
                updateStatus(data.errors.map(e => `<p class="${statusEl.params.errorClass}">${e}</p>`).join(''));
                updateSuggestions(data.suggestions || []);
            }
        };

        input.on('input', () => {
            clearTimeout(debounceTimer);
            const slug = input.node.value.trim().toLowerCase();
            debounceTimer = this.setTimeout(() => checkAvailability(slug), 300);
        });

        suggestionsEl.on('click', (e) => {
            const suggestion = e.target.getAttribute('data-suggestion');
            if(suggestion){
                input.node.value = suggestion;
                checkAvailability(suggestion);
            }
        });

        claimButton.on('click', async () => {
            const slug = input.node.value.trim().toLowerCase();
            if(!isAvailable || !slug) return;

            claimButton.node.disabled = true;
            claimButton.patch('Claiming...');

            const formData = new FormData();
            formData.append('slug', slug);

            const response = await fetch('/_actions/admin/claim_site', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if(data.success){
                const newUrl = `${window.location.protocol}//${data.newHost}`;
                window.location.href = newUrl;
            } else {
                claimButton.node.disabled = false;
                claimButton.patch('Claim');
                updateStatus(data.errors.map(e => `<p class="${statusEl.params.errorClass}">${e}</p>`).join(''));
            }
        });

        claimButton.node.disabled = true;
    }
};

export default {
    async render(){
        return this.renderHtml`
            <pinstripe-modal>
                ${this.renderView('_panel', {
                    title: 'Claim Your Site',
                    body: this.renderHtml`
                        <div class="${this.cssClasses.root}" data-claim-form>
                            <p class="${this.cssClasses.description}">Choose a memorable subdomain for your blog. This will replace your current temporary URL.</p>
                            <div class="${this.cssClasses.inputGroup}">
                                <input
                                    type="text"
                                    class="${this.cssClasses.input}"
                                    data-subdomain-input
                                    placeholder="my-awesome-blog"
                                    autocomplete="off"
                                    autocapitalize="off"
                                    spellcheck="false"
                                />
                                <span class="${this.cssClasses.suffix}">.blognami.com</span>
                            </div>
                            <div class="${this.cssClasses.status}" data-status data-error-class="${this.cssClasses.errorText}" data-available-class="${this.cssClasses.availableText}"></div>
                            <div class="${this.cssClasses.suggestions}" data-suggestions data-suggestion-class="${this.cssClasses.suggestion}" style="display: none;">
                                <p class="${this.cssClasses.suggestionsLabel}">Try one of these instead:</p>
                                <ul class="${this.cssClasses.suggestionList}" data-suggestion-list></ul>
                            </div>
                            <div class="${this.cssClasses.footer}">
                                ${this.renderView('_button', {
                                    body: this.renderHtml`
                                        Cancel
                                        <script type="pinstripe">
                                            this.parent.on('click', () => this.trigger('close'));
                                        </script>
                                    `
                                })}
                                ${this.renderView('_button', {
                                    body: 'Claim',
                                    isPrimary: true,
                                    ['data-claim-button']: '',
                                })}
                            </div>
                        </div>
                    `
                })}
            </pinstripe-modal>
        `;
    }
};
