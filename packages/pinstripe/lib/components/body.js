
import { Component } from "../component.js";

Component.register('pinstripe-body', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.shadow.patch(`
            <pinstripe-progress-bar></pinstripe-progress-bar>
            <slot>
            <div class="styles"></div>
        `);
    },

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
