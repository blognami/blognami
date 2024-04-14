
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

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
                    bottom: 0;
                    left: 0;
                    right: 0;
                    top: 0;
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
                .body {
                    max-height: calc(100vh - 4.0rem);
                    max-width: calc(100vw - 16.0rem);
                    margin: 0 auto;
                }
                ::slotted(*) {
                    width: 64.0rem;
                    max-width: 100%;
                    max-height: 100%;
                }
            </style>
            <div class="root">
                <button class="close-button"></button>
                <div class="body"><slot></div>
            </div>
        `);

        this.shadow.on('click', '.root, .close-button', () => this.trigger('close'));
    },

    isModal: true
}

