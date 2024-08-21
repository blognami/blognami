
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        if(!this.overlay) return;

        this.document.body.clip();

        const { width = 'medium', height = 'auto' } = this.params;

        this.shadow.patch(`
            <style>
                .root {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                    overflow: auto;
                    z-index: 40;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(10, 10, 10, 0.86);
                }
                .close-button {
                    background: none;
                    position: fixed;
                    right: 2.0rem;
                    top: 2.0rem;
                    height: 3.2rem;
                    width: 3.2rem;
                    user-select: none;
                    -webkit-appearance: none;
                    border: none;
                    border-radius: 999.9rem;
                    cursor: pointer;
                    pointer-events: auto;
                    display: inline-block;
                    flex-grow: 0;
                    flex-shrink: 0;
                    font-size: 0;
                    outline: none;
                    vertical-align: top;
                }
                .close-button:before, .close-button:after {
                    background-color: white;
                    content: '';
                    display: block;
                    left: 50%;
                    position: absolute;
                    top: 50%;
                    transform: translateX(-50%) translateY(-50%) rotate(45deg);
                    transform-origin: center center;
                    box-sizing: inherit;
                }
                .close-button:before {
                    height: 0.2rem;
                    width: 50%;
                }
                .close-button:after {
                    height: 50%;
                    width: 0.2rem;
                }
                .container {
                    min-height: calc(100vh - 4.0rem);
                    width: calc(100vw - 16.0rem);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .body {
                    max-width: 100%;
                }
                .root.is-medium-width .body {
                    width: 800px;
                }
                .root.is-full-width .body {
                    width: 100%;
                }
                .root.is-full-height .body {
                    height: 100%;
                }
            </style>
            <div class="root is-${width}-width is-${height}-height">
                <button class="close-button"></button>
                <div class="container">
                    <div class="body">
                        <slot>
                    </div>
                </div>
            </div>
        `);

        this.shadow.on('click', '.root, .container, .body, .close-button', () => this.trigger('close'));

        this.on('clean', () => this.document.body.unclip());

        const popoverOverlays = [];
        let currentAnchor = this.overlay.parent;
        while(currentAnchor.is('pinstripe-popover *')){
            popoverOverlays.push(currentAnchor.overlay);
            currentAnchor = currentAnchor.overlay.parent;
        }
        delete this.overlay.parent._overlayChild;
        this.overlay._parent = currentAnchor;
        currentAnchor._overlayChild = this.overlay;
        while(popoverOverlays.length){
            popoverOverlays.shift().remove();
        }
        
    },

    isModal: true
}

