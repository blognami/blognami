
import { IS_SERVER } from 'haberdash/lib/constants.js';
import { Job, STATIC_ASSET_HEADER } from 'blognami';

export default {
    create(){
        return { IS_SERVER, Job, STATIC_ASSET_HEADER };
    }
};
