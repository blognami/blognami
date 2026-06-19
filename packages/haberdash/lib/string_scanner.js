
import { Class } from './class.js';

export const StringScanner = Class.extend('StringScanner').include({
    initialize(string){
        this.initialString = (string || '').toString();
        this.string = this.initialString;   // the cursor: a shrinking suffix of initialString
    },

    get length(){
        return this.string.length
    },

    // everything consumed so far — `string` is always a suffix of `initialString`,
    // so the consumed prefix is just the length difference
    get consumedString(){
        return this.initialString.slice(0, this.initialString.length - this.string.length);
    },

    // char immediately left of the cursor ('' at the start) — CommonMark flanking
    get previousChar(){
        return this.consumedString.slice(-1);
    },

    // 1-based line of the cursor, from the newlines already consumed
    get line(){
        return (this.consumedString.match(/\n/g) || []).length + 1;
    },

    toString(){
        return this.string
    },

    scan(...args){
        const out = this.match(...args)
        if(out){
            this.string = this.string.substr(out[0].length)   // advance the cursor
        }
        return out
    },

    // String.match relative to the cursor — no advance (renamed from `check`)
    match(...args){
        return this.string.match(...args)
    },

    // consume one line + its terminator; return the content without the newline
    scanLine(){
        return this.scan(/^([^\n]*)(?:\n|$)/)[1]
    },

    // the next line's content (no newline), WITHOUT consuming
    matchLine(){
        return this.match(/^[^\n]*/)[0]
    }
});
