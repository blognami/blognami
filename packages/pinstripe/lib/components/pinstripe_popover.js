
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        if(!this.overlay) return;

        this.position = this.overlay.parent.params.dropdownPosition || 'bottom-center';

        this.shadow.patch(`
            <style>
                :host {
                    position: absolute;
                }
            </style>
            <slot>
        `);

        this.repositionHandler = this.reposition.bind(this);
        this.resizeOberver = new ResizeObserver(this.repositionHandler);
        this.resizeOberver.observe(this.node);
        window.addEventListener('resize', this.repositionHandler);
        window.addEventListener('scroll', this.repositionHandler);
        this.reposition();
        
        this.on('click', (event) => {
            event.stopPropagation();
        });

        const anchor = this.overlay.parent;
        const { attributes: anchorAttributes } = anchor;

        anchor.patch({ ...anchorAttributes, 'data-active': 'true' });

        this.closeHandler = () => this.overlay.remove();
        window.addEventListener('click', this.closeHandler);

        this.on('clean', () => {
            this.resizeOberver.disconnect();
            window.removeEventListener('resize', this.repositionHandler);
            window.removeEventListener('scroll', this.repositionHandler);
            window.removeEventListener('click', this.closeHandler);
            anchor.patch(anchorAttributes);
        });
    },

    isPopover: true,

    reposition(){
        if(!this.overlay.parent) return;

        const gap = 4;

        const [ side = 'bottom', align = 'center' ] = this.position.split('-');
        const anchorRect = this.overlay.parent.node.getBoundingClientRect();
        const rect = this.node.getBoundingClientRect();

        let left = 0;
        let top = 0;
        
        if(side == 'top' || side == 'bottom'){
            left = anchorRect.left;
            if(align == 'center') left += anchorRect.width / 2 - rect.width / 2;
            if(align == 'right') left += anchorRect.width - rect.width;

            if(side == 'top') top = anchorRect.top - rect.height - gap;
            if(side == 'bottom') top = anchorRect.top + anchorRect.height + gap;
        }
        
        if(side == 'left' || side == 'right'){
            left = anchorRect.left;
            if(side == 'left') left -= (rect.width + gap);
            if(side == 'right') left += (anchorRect.width + gap);

            top = anchorRect.top;
            if(align == 'top') top += anchorRect.height;
            if(align == 'center') top += anchorRect.height / 2 - rect.height / 2;
            if(align == 'bottom') top += anchorRect.height - rect.height;
        }

        this.node.style.left = `${left}px`;
        this.node.style.top = `${top}px`;
    }
};
