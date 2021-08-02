
import { defineService } from 'pinstripe';

defineService('cookies', { scope: 'root' }, ({ params }) => {
    const out = {};
    const cookieHeader = params._headers?.cookie;
    if(cookieHeader){
        cookieHeader.split(/;/).forEach(cookie => {
            const matches = cookie.trim().match(/^([^=]+)=(.*)$/);
            if(matches){
                out[matches[1]] = decodeURI(matches[2]);
            }
        });
    }
    return out;
});
