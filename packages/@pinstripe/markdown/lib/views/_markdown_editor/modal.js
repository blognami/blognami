
export const styles = ({ colors, shadow, remify, fonts }) => `
    .root {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: ${colors.white};
        z-index: 1;
        margin: 0 auto;
    }
    .toolbar {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 0;
        padding: 0 ${remify(12)};
        overflow: hidden;
        border-bottom: 0 solid ${colors.gray[300]};
        transition: height 0.2s ease;
    }
    .toolbar:has(button[data-display="true"]) {
        height: ${remify(48)};
        border-bottom-width: ${remify(1)};
    }
    .panes {
        flex: 1 1 0;
        min-height: 0;
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .text-pane, .side-panes {
        flex: 1 1 0;
        height: 100%;
        min-height: 0;
        min-width: 0;
    }
    .side-panes {
        display: flex;
        flex-direction: column;
    }
    .text-pane {
        position: relative;
        border-style: solid;
        border-width: 0 ${remify(1)} 0 0;
        border-color: ${colors.gray[500]};
        padding: 0;
    }
    .text-pane > textarea {
        border: none;
        height: 100%;
        width: 100%;
        resize: none;
        outline: none;
        padding: 1em;
        font-family: ${fonts.sans};
        font-size: ${remify(16)};
        line-height: 1.5;
    }
    .preview-pane {
        flex: 1 1 0;
        min-height: 0;
        min-width: 0;
        overflow-y: auto;
        padding: 1em;
    }
    .context-pane {
        display: none;
        flex: 0 1 auto;
        max-height: 50%;
        min-width: 0;
        overflow-y: auto;
        padding: 1em;
        border-bottom: ${remify(1)} solid ${colors.gray[300]};
    }
    .root[data-has-context="true"] .context-pane {
        display: block;
    }

    .preview-pane pinstripe-frame > * + * {
        margin-top: ${remify(20)};
    }
    .toolbar button {
        display: none;
        background: color-mix(in oklch, ${colors.white} 95%, transparent);
        border: ${remify(1)} solid ${colors.gray[300]};
        border-radius: ${remify(3)};
        padding: ${remify(4)} ${remify(8)};
        font-size: ${remify(12)};
        color: ${colors.gray[700]};
        cursor: pointer;
        box-shadow: ${shadow['2xs']};
        transition: all 0.2s ease;
    }
    .toolbar button[data-display="true"] {
        display: block;
    }
    .toolbar button:hover {
        background: ${colors.white};
        border-color: ${colors.gray[400]};
        box-shadow: ${shadow.sm};
    }
    .toolbar button:active {
        transform: translateY(${remify(1)});
        box-shadow: ${shadow.xs};
    }
    .save-error {
        display: none;
        margin-right: ${remify(12)};
        font-size: ${remify(12)};
        color: ${colors.red[500]};
    }
    .save-error[data-display="true"] {
        display: block;
    }
    .restore-banner {
        display: none;
        flex: 0 0 auto;
        align-items: center;
        gap: ${remify(12)};
        padding: ${remify(8)} ${remify(12)};
        background: ${colors.gray[200]};
        border-bottom: ${remify(1)} solid ${colors.gray[300]};
        font-size: ${remify(12)};
        color: ${colors.gray[700]};
    }
    .restore-banner[data-display="true"] {
        display: flex;
    }
    .restore-banner [data-part="restore-banner-message"] {
        margin-right: auto;
    }
    .restore-banner button {
        background: color-mix(in oklch, ${colors.white} 95%, transparent);
        border: ${remify(1)} solid ${colors.gray[300]};
        border-radius: ${remify(3)};
        padding: ${remify(4)} ${remify(8)};
        font-size: ${remify(12)};
        color: ${colors.gray[700]};
        cursor: pointer;
        box-shadow: ${shadow['2xs']};
        transition: all 0.2s ease;
    }
    .restore-banner button:hover {
        background: ${colors.white};
        border-color: ${colors.gray[400]};
        box-shadow: ${shadow.sm};
    }
    .restore-banner button:active {
        transform: translateY(${remify(1)});
        box-shadow: ${shadow.xs};
    }
    .view-toggle {
        display: none;
        margin-right: auto;
        border: ${remify(1)} solid ${colors.gray[300]};
        border-radius: ${remify(3)};
        overflow: hidden;
    }
    .view-toggle button {
        display: block;
        border: none;
        border-radius: 0;
        box-shadow: none;
        background: ${colors.white};
        padding: ${remify(4)} ${remify(10)};
        font-size: ${remify(12)};
        color: ${colors.gray[700]};
        cursor: pointer;
        transition: background 0.15s ease;
    }
    .view-toggle button + button {
        border-left: ${remify(1)} solid ${colors.gray[300]};
    }
    .view-toggle [data-part="context-toggle"] {
        display: none;
    }
    .view-toggle [data-part="preview-toggle"] {
        display: none;
    }
    .root[data-mobile-view="edit"] .view-toggle [data-part="edit-toggle"],
    .root[data-mobile-view="preview"] .view-toggle [data-part="preview-toggle"],
    .root[data-mobile-view="context"] .view-toggle [data-part="context-toggle"] {
        background: ${colors.gray[200]};
        color: ${colors.gray[900]};
    }

    @media (max-width: 47.99rem) {
        .toolbar {
            height: ${remify(48)};
            border-bottom-width: ${remify(1)};
        }
        .view-toggle {
            display: flex;
        }
        .view-toggle [data-part="preview-toggle"] {
            display: block;
        }
        .root[data-slash-line="true"] .view-toggle {
            display: none;
        }
        .panes {
            flex-direction: column;
            gap: ${remify(16)};
        }
        .text-pane, .preview-pane {
            height: auto;
        }
        .text-pane {
            border-width: 0;
        }
        .side-panes {
            display: contents;
        }
        .context-pane {
            max-height: none;
            border-bottom: none;
        }
        .root[data-has-context="true"] .context-pane {
            display: none;
        }
        .root[data-mobile-view="context"] .context-pane {
            display: block;
        }
        .root[data-mobile-view="context"] .text-pane,
        .root[data-mobile-view="context"] .preview-pane {
            display: none;
        }
        .root[data-has-context="true"] .view-toggle [data-part="context-toggle"] {
            display: block;
        }
        .root[data-mobile-view="edit"] .preview-pane {
            display: none;
        }
        .root[data-mobile-view="preview"] .text-pane {
            display: none;
        }
        .root[data-slash-line="true"] .text-pane,
        .root[data-slash-line="true"] .preview-pane {
            display: block;
        }
        .root[data-slash-line="true"] .text-pane::after {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -${remify(10)};
            width: ${remify(40)};
            height: ${remify(4)};
            border-radius: ${remify(999)};
            background: ${colors.gray[400]};
        }
    }
`;

export const decorators = {
    modal(){
        const anchorTextarea = this.frame.parent;
        const editorTextarea = this.find('[data-part="editor-textarea"]');
        const saveChangesButton = this.find('[data-part="save-changes-button"]');
        const restoreBanner = this.find('[data-part="restore-banner"]'); // hidden on edit / Discard / Save
        const hasSaveChangesButton = anchorTextarea.params.hasSaveChangesButton === 'true';

        // Layer 2a: autosave the editor content to localStorage so it survives a
        // failed save, reload, or crash. Keyed per edit-action frame URL × field;
        // JSON-encoding the parts keeps the segment boundaries unambiguous.
        const draftPrefix = 'markdown-editor-draft:';
        const draftTtl = 14 * 24 * 60 * 60 * 1000; // ~14 days
        const frameUrl = new URL(anchorTextarea.frame.url, window.location.origin);
        // The editor double-renders on open (cached markup, then fresh markup), and
        // the first render's preview sync writes the editor value back onto the
        // anchor. Capture the server value once on the (stable) anchor node so the
        // baseline survives that round-trip — otherwise the second render reads a
        // draft-polluted anchor and the restore (below) is silently skipped.
        const anchorNode = anchorTextarea.node;
        if(anchorNode.__markdownEditorServerValue === undefined){
            anchorNode.__markdownEditorServerValue = anchorTextarea.value;
        }
        const draftBaseline = anchorNode.__markdownEditorServerValue;
        const draftKey = `${draftPrefix}${JSON.stringify([frameUrl.pathname, frameUrl.search, anchorTextarea.name])}`;

        const sweepDrafts = () => {
            const now = Date.now();
            const staleKeys = [];
            for(let i = 0; i < window.localStorage.length; i++){
                const key = window.localStorage.key(i);
                if(!key || !key.startsWith(draftPrefix)) continue;
                let savedAt;
                try { savedAt = JSON.parse(window.localStorage.getItem(key)).savedAt; } catch(e) { continue; }
                if(typeof savedAt === 'number' && now - savedAt > draftTtl) staleKeys.push(key);
            }
            staleKeys.forEach(key => window.localStorage.removeItem(key));
        };

        const writeDraft = () => {
            const value = editorTextarea.value;
            if(value === draftBaseline) return; // nothing unsaved
            const record = JSON.stringify({ value, baseline: draftBaseline, savedAt: Date.now() });
            try {
                window.localStorage.setItem(draftKey, record);
            } catch(e) {
                if(e && e.name === 'QuotaExceededError'){
                    sweepDrafts();
                    try { window.localStorage.setItem(draftKey, record); } catch(e2) { /* degrade silently */ }
                }
            }
        };

        const clearDraft = () => window.localStorage.removeItem(draftKey);

        let draftWriteTimer;
        const scheduleDraftWrite = () => {
            draftWriteTimer?.destroy();
            draftWriteTimer = this.setTimeout(writeDraft, 500);
        };

        sweepDrafts();

        editorTextarea.value = anchorTextarea.value;
        editorTextarea.focus();
        editorTextarea.selectionStart = anchorTextarea.selectionStart;
        editorTextarea.selectionEnd = anchorTextarea.selectionEnd;

        // Layer 2b: restore an autosaved draft on open. `draftBaseline` is the
        // field's current server value (captured above when the editor opened).
        // Scoped to editors with a Save Changes button (post/page body, site
        // navigation): only those clear the draft on a confirmed save (layer 1),
        // so restoring elsewhere — e.g. comment editors submitted via their own
        // form — would resurrect already-submitted content.
        let previousValue; // declared early so the Discard handler can resync change detection
        // Skip on the throwaway cached render so the restore — and its confirm — runs
        // once, on the fresh render the user keeps (the same guard pinstripe-script and
        // pinstripe-redirect use to avoid double-firing).
        if(hasSaveChangesButton && !this.isFromCachedHtml){
            const restoreBannerMessage = this.find('[data-part="restore-banner-message"]');

            this.find('[data-part="discard-draft"]').on('click', () => {
                editorTextarea.value = draftBaseline;
                previousValue = draftBaseline;   // revert isn't a user edit — keep the poll from re-showing Save Changes
                updatePreview();                 // poll won't fire now, so refresh the preview ourselves
                clearDraft();
                saveChangesButton.attributes['data-display'] = 'false';
                restoreBanner.attributes['data-display'] = 'false';
            });

            let draft;
            try { draft = JSON.parse(window.localStorage.getItem(draftKey)); } catch(e) { draft = null; }
            if(draft && typeof draft.value === 'string' && draft.value !== draftBaseline){
                // A draft equal to the server value is a no-op and isn't offered. If the
                // record changed elsewhere since the draft (`baseline` drifted from the
                // current server value), confirm before overwriting rather than clobbering.
                const changedElsewhere = draft.baseline !== draftBaseline;
                if(!changedElsewhere || window.confirm('This was changed elsewhere since your draft. Restore your unsaved draft anyway?')){
                    editorTextarea.value = draft.value;
                    const savedAt = typeof draft.savedAt === 'number' ? new Date(draft.savedAt).toLocaleString() : 'an earlier session';
                    restoreBannerMessage.text = `Restored unsaved draft from ${savedAt}`;
                    restoreBanner.attributes['data-display'] = 'true';
                    // The restored draft is unsaved content — offer Save right away.
                    saveChangesButton.attributes['data-display'] = 'true';
                }
            }
        }

        const previewFrame = this.frame.find('[data-part="editor-preview-pane"] pinstripe-frame');
    
        previewFrame.observe((current) => {
            while(current.parent && current.parent != previewFrame) {
                current = current.parent;
            }
            if(current.node.scrollIntoView) current.node.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        })

        const updatePreview = () => {
            const { value } = this.values;
            const formData = new FormData();
            formData.append('value', value);
            previewFrame.load(previewFrame.url, { method: 'POST', body: formData });
            anchorTextarea.value = value;
        };

        updatePreview();
        
        previousValue = editorTextarea.value;
        this.setInterval(() => {
            const { value } = editorTextarea;
            if(previousValue != value){
                previousValue = value;
                updatePreview();
                scheduleDraftWrite();
                if(hasSaveChangesButton){
                    saveChangesButton.attributes['data-display'] = 'true';
                    restoreBanner.attributes['data-display'] = 'false'; // the draft notice has served its purpose once editing begins
                }
            }
        }, 100);

        const root = this.find('[data-part="editor-root"]');

        const setMobileView = view => {
            root.attributes['data-mobile-view'] = view;
        };
        setMobileView('edit');

        this.find('[data-part="edit-toggle"]').on('click', () => setMobileView('edit'));
        this.find('[data-part="preview-toggle"]').on('click', () => setMobileView('preview'));

        const { contextUrl } = anchorTextarea.params;
        if(contextUrl){
            root.attributes['data-has-context'] = 'true';
            const contextFrame = this.find('[data-part="editor-context-pane"] pinstripe-frame');
            contextFrame.on('load', (event) => {
                const { patched, body } = event.detail;
                if(patched) return;
                const matches = `${body}`.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                contextFrame.patch(matches ? matches[1] : `${body}`);
            });
            contextFrame.load(contextUrl, { skipPatch: true });
            this.find('[data-part="context-toggle"]').on('click', () => setMobileView('context'));
        }

        const updateSlashLine = () => {
            const { value } = editorTextarea;
            const position = editorTextarea.node.selectionStart;
            const lineStart = value.lastIndexOf('\n', position - 1) + 1;
            const newlineIndex = value.indexOf('\n', position);
            const lineEnd = newlineIndex === -1 ? value.length : newlineIndex;
            const line = value.slice(lineStart, lineEnd);
            root.attributes['data-slash-line'] = /^\//.test(line) ? 'true' : 'false';
        };
        updateSlashLine();
        ['input', 'keyup', 'click', 'select'].forEach(eventName => {
            editorTextarea.on(eventName, updateSlashLine);
        });

        this.assignProps({
            replaceLine(index, content){
                const lines = editorTextarea.value.split(/\n/);
                lines[index] = content;
                editorTextarea.value = lines.join('\n');
                editorTextarea.focus();
                const position = lines.slice(0, index + 1).join('\n').length;
                editorTextarea.node.selectionStart = position;
                editorTextarea.node.selectionEnd = position;
                updateSlashLine();
            }
        });

        const saveError = this.find('[data-part="save-error"]');

        // Submit the held editor content via the host form (skipPatch keeps the
        // page from navigating). Inspect the load result instead of assuming
        // success: a dropped auth redirect routes to inline re-auth (layer 3); any
        // other failure preserves the content and surfaces a message (layer 1);
        // success clears the local draft.
        const submitSave = () => {
            saveError.attributes['data-display'] = 'false';
            restoreBanner.attributes['data-display'] = 'false';
            writeDraft();

            const subscription = this.form.frame.on('load', (event) => {
                subscription.destroy();
                const { status, body } = event.detail;
                const authRedirect = `${body}`.match(/<pinstripe-redirect[^>]*\burl=["']([^"']*sign_in[^"']*)["']/i);
                if(authRedirect){
                    reauthenticate(authRedirect[1].replace(/&amp;/g, '&'));
                    return;
                }
                if(status >= 400){
                    saveChangesButton.attributes['data-display'] = 'true';
                    saveError.html = 'Couldn’t save your changes. Please try again — your changes are still here.';
                    saveError.attributes['data-display'] = 'true';
                    return;
                }
                clearDraft();
                saveChangesButton.attributes['data-display'] = 'false';
            });

            this.form.submit({ skipPatch: true });
        };

        // Layer 3: re-authenticate in place. Follow the dropped auth redirect by
        // opening guest/sign_in in an overlay stacked above the editor modal — the
        // same target="_overlay" mechanism the "Add Image" slash-block uses;
        // pinstripe_modal keeps the editor open underneath. Hold the pending
        // content and, once re-auth returns past the guard, remove the overlay and
        // resubmit it — rather than the auth flow's default document.load() reload,
        // which would discard the still-open editor and its unsaved edit.
        const reauthenticate = (signInUrl) => {
            const heldValue = editorTextarea.value;

            const overlay = this.document.find('body').append('<pinstripe-overlay load-on-init="false"></pinstripe-overlay>').pop();
            overlay._parent = this;
            this._overlayChild = overlay;

            const subscription = overlay.on('load', () => {
                if(/\/_actions\/guest\/sign_in/.test(overlay.url.pathname)) return; // still signing in
                subscription.destroy();
                overlay.remove();
                anchorTextarea.value = heldValue;
                submitSave();
            });

            overlay.load(signInUrl, { method: 'GET' });
        };

        saveChangesButton.on('click', submitSave);
    },

    lineInserter(){
        this.on('click', () => {
            const { lineContent } = this.params;
            const { lineNumber } = this.parents.find(n => n.is('[data-line-number]')).params;

            this.modal.replaceLine(lineNumber - 1, lineContent);
        });
    }
};

export default {
    render(){
        return this.renderHtml`
            <pinstripe-modal class="${this.cssClasses.modal}" width="75rem" height="full">
                <div class="${this.cssClasses.root}" data-part="editor-root">
                    <div class="${this.cssClasses.toolbar}">
                        <div class="${this.cssClasses.viewToggle}">
                            <button type="button" data-part="edit-toggle">Edit</button>
                            <button type="button" data-part="preview-toggle">Preview</button>
                            <button type="button" data-part="context-toggle" data-test-id="context-toggle">Context</button>
                        </div>
                        <span class="${this.cssClasses.saveError}" data-part="save-error" data-test-id="save-error" data-display="false"></span>
                        <button data-part="save-changes-button">Save Changes</button>
                    </div>
                    <div class="${this.cssClasses.restoreBanner}" data-part="restore-banner" data-test-id="restore-banner" data-display="false">
                        <span data-part="restore-banner-message"></span>
                        <button type="button" data-part="discard-draft" data-test-id="discard-draft">Discard</button>
                    </div>
                    <div class="${this.cssClasses.panes}">
                        <div class="${this.cssClasses.textPane}">
                            <textarea name="value" data-part="editor-textarea">${this.params.value}</textarea>
                        </div>
                        <div class="${this.cssClasses.sidePanes}">
                            <div class="${this.cssClasses.contextPane}" data-part="editor-context-pane" data-test-id="context-pane">
                                <pinstripe-frame load-on-init="false"></pinstripe-frame>
                            </div>
                            <div class="${this.cssClasses.previewPane}" data-part="editor-preview-pane">
                                ${this.renderView('_pinstripe/_content', {
                                    body: this.renderHtml`<pinstripe-frame url="/_markdown_editor/preview" load-on-init="false"></pinstripe-frame>`
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </pinstripe-modal>
        `;
    }
};
