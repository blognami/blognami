
import { Component } from "../component.js";

Component.register('pinstripe-menu', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        
        this.shadow.patch(`
            <style>
                .root {
                    background: #fff;
                    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
                    border-radius: 6px;
                    width: 100vw;
                    max-width: 250px;
                    padding: 6px 0;
                }
                
                ::slotted(a) {
                    display: block;
                    padding: 6px 12px;
                    text-decoration: none;
                    color: #000;
                }
                
                ::slotted(a:hover) {
                    background: #f7f7f7;
                }
            </style>
            <div class="root"><slot></div>
        `);
    }
});
