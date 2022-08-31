
import { defineDecorator } from "../node_wrapper.js";

defineDecorator('pinstripe-body', function (){
    this.shadow.patch(`
        <pinstripe-progress-bar></pinstripe-progress-bar>
        <slot>
        <div class="styles"></div>
    `);

    this.assignProps({
        get progressBar(){
            if(!this._progressBar){
                this._progressBar = this.shadow.find('pinstripe-progress-bar');
            }
            return this._progressBar;
        },
        
        clip(){
            this.shadow.find('.styles').patch(`
                <style>
                    :host {
                        overflow: hidden !important;
                    }
                </style>
            `);
        },

        unclip(){
            this.shadow.find('.styles').patch('');
        }
    });

});

defineDecorator('body', function(){
    this.apply('pinstripe-body');
});
