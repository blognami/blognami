
import { defer } from 'haberdash';

import { Table } from "sintra/database";

export default {
    meta(){
        this.hasMany('comments',  { fromKey: 'id', toKey: 'commentableId' });
    },

    get rootCommentable(){
        return defer(async () => {
            if(this.constructor.name != 'comment') return this;
            return this.commentable.rootCommentable;
        });
    }
}
