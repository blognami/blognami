
import { defineService } from 'pinstripe';

defineService('renderScript', async ({ overload, renderHtml }) => {
    return overload({
        function(fn){
            return renderHtml(`<script type="pinstripe">\n(${fn})();</script>`);
        },
        
        string(value){
            return renderHtml(`<script type="pinstripe">${value}</script>`);
        }
    });
});
