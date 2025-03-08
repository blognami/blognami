
import { Class } from './class.js';

export const LruCache = Class.extend().include({
    meta(){
        this.assignProps({
            maxEntries: 1000
        });
    },

    initialize(){
        this.entries = {};
        this.index = [];
    },

    put(key, value){
        if(!this.entries[key]){
            this.entries[key] = { key, position: this.index.length };
            this.index.push(this.entries[key]);
            this.promote(key);
            this.evict();
        }
        this.entries[key].value = value;
    },

    get(key){
        const entry = this.entries[key];
        if(!entry) return;
        this.promote(key);
        return entry.value;
    },

    hasEntry(key){
        return !!this.entries[key];
    },

    promote(key){
        const entry = this.entries[key];
        if(!entry || entry.position == 0) return;
        const previousEntry = this.index[entry.position - 1];
        this.index[entry.position] = previousEntry;
        this.index[previousEntry.position] = entry;
        previousEntry.position++;
        entry.position--;
    },

    evict(){
        while(this.index.length > this.constructor.maxEntries){
            const entry = this.index.pop();
            delete this.entries[entry.key];
        }
    }
});
