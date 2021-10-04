
import { defineWidget } from 'pinstripe';

defineWidget('overlay', {
    meta(){
        this.include('frame');
    },

    initialize(...args){
        this.constructor.classes.frame.prototype.initialize.call(this, ...args);

        this.on('click', '.p-close', (event) => {
            event.stopPropagation();
            this.close();
        });
    },

    close(){
        this.remove();
        if(!this.document.find('body').pop().children.filter((child) => child.is('*[data-widget="overlay"]')).length){
            this.document.find('html').pop().removeClass('p-clip');
        }
    }
});
