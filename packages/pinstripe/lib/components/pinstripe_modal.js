

const MOBILE_HEIGHT_MAP = {
    full: 'calc(100vh - 8.2rem)',
}

const DESKTOP_WIDTH_MAP = {
    small: '600px',
    medium: '800px',
    large: '1000px',
    auto: '0',
    full: '0'
};

const DESKTOP_HEIGHT_MAP = {
    full: 'calc(100vh - 4rem)',
};

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        if(!this.overlay) return;

        this.document.body.clip();

        const { width = 'medium', height = 'auto' } = this.params;

        const mobileHeight = MOBILE_HEIGHT_MAP[height] || height;
        const desktopWidth = DESKTOP_WIDTH_MAP[width] || width;
        const desktopHeight = DESKTOP_HEIGHT_MAP[height] || height;

        this.shadow.patch(`
            <style>
                .root {
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
                    display: inline-block;
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

                @media (max-width: 766px) {
                    .container {
                        width: 100vw;
                        min-height: 100vh;
                        display: grid;
                        grid-template-columns: [grid-start] 1rem [full-start] auto [full-end] 1rem [grid-end];
                        grid-template-rows: [grid-start] 0 [top-start] 7.2rem [top-end] 0 [full-start] ${mobileHeight} [full-end] 1rem [grid-end];
                    }

                    .close-button {
                        grid-area: top / full;
                        position: absolute;
                        right: 2rem;
                        top: 2rem;
                    }

                    .body {
                        grid-area: full;
                    }
                }

                @media (min-width: 767px) {
                    .container {
                        width: 100vw;
                        min-height: 100vh;
                        display: grid;
                        grid-template-columns: [grid-start] 7.2rem [full-start] auto [fixed-start] minmax(0, ${desktopWidth}) [fixed-end] auto [full-end] 7.2rem [grid-end];
                        grid-template-rows: [grid-start] 2rem [full-start] ${desktopHeight} [full-end] 2rem [grid-end];
                    }

                    .close-button {
                        position: fixed;
                        right: 2.0rem;
                        top: 2.0rem;
                    }

                    .body {
                        grid-area: full / ${['auto', 'full'].includes(desktopWidth) ? 'full' : 'fixed'};
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                        justify-content: center;
                    }
                }
            </style>
            <div class="root">
                <div class="container">
                    <button class="close-button"></button>
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

