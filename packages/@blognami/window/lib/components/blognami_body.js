
import { Component } from "../component.js";

Component.register('blognami-body',  {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.shadow.patch(`
            <blognami-progress-bar></blognami-progress-bar>
            <slot>
            <div class="styles"></div>
        `);

        this.clipCounter = 0;
    },

    get progressBar(){
        if(!this._progressBar){
            this._progressBar = this.shadow.find('blognami-progress-bar');
        }
        return this._progressBar;
    },
    
    clip(){
        this.clipCounter++;
        if(this.clipCounter == 1) this.shadow.find('.styles').patch(`
            <style>
                :host {
                    overflow: hidden !important;
                }
            </style>
        `);
    },

    unclip(){
        this.clipCounter--;
        if(this.clipCounter <= 0){
            this.clipCounter = 0;
            this.shadow.find('.styles').patch('');
        }
    }
});
