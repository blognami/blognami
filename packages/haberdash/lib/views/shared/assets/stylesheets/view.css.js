
import { View } from 'haberdash';

let out;

export default {
    async render(){
        if(!out){
            const buffer = [];
            for(let viewName of this.app.viewNames){
                const resolvedViewName = this.app.viewMapper.resolveView(viewName);
                const styles = await View.renderStyles(this.context, resolvedViewName);
                if(styles) buffer.push(styles);
            }
            out = buffer.join('');
        }
    
        return [200, { 'content-type': 'text/css'}, [ out ]];
    }
};