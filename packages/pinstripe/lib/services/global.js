
import * as pinstripe from 'pinstripe';

Object.keys(pinstripe).forEach(name => {
    if(name.match(/^define/)){
        return;
    }
    pinstripe.defineService(name, () => pinstripe[name])
})
