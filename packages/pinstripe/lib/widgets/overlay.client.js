
import { defineWidget } from 'pinstripe';

defineWidget('overlay', {
    meta(){
        this.include('frame');

        this.parent.prototype.assignProps({
            isOverlay: false,

            get overlay(){
                return this.parents.find(({ isOverlay }) => isOverlay);
            }
        });
    },

    isOverlay: true,

    close(){
        this.remove();
        if(!this.document.descendants.find(node => node.is('body')).children.filter((child) => child.is('*[data-widget="overlay"]')).length){
            this.document.descendants.filter(node => node.is('html')).forEach(node => {
                const { attributes } = node;
                delete attributes['data-clipped'];
                node.patch(attributes);
            })
        }
    }
});
