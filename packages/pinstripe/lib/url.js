
import { Base } from './base.js';
import { StringReader } from './string_reader.js';

export const Url = Base.extend().open(Class => Class
    .staticProps({
        fromString(url, referenceUrl){
            const out = new Url()
            url = new StringReader(url)
            if(!(referenceUrl instanceof Url)){
                referenceUrl = Url.fromString(referenceUrl || window.location, new Url())
            }
            
            let matches;
    
            if(matches = url.match(/^([a-z]+):\/\/([a-z\.-]+)/i)){
                out.protocol = matches[1].toLowerCase()
                out.host = matches[2].toLowerCase()
                if(matches = url.match(/^:(\d+)/)){
                    out.port = parseInt(matches[1])
                }
            } else {
                out.protocol = referenceUrl.protocol
                out.host = referenceUrl.host
                out.port = referenceUrl.port
            }
    
            if(matches = url.match(/^\/[^\?\#]*/)){
                out.path = normalizePath(matches[0])
            } else if(matches = url.match(/^[^\?\#]+/)){
                out.path = normalizePath(`${referenceUrl.path.replace(/[^\/]*$/, '')}${matches[0]}`)
            } else {
                out.path = referenceUrl.path
            }
    
            if(matches = url.match(/^\?([^\#]*)/)){
                matches[1].split(/&/).forEach((pair) => {
                    const [key, value] = pair.split(/=/)
                    out.params[decodeURIComponent(key)] = decodeURIComponent(value)
                })
            }
    
            return out
        }
    })
    .props({
        initialize(protocol = 'http', host = 'localhost', port = 80, path = '/', params = {}){
            this.protocol = protocol
            this.host = host
            this.port = port
            this.path = path
            this.params = params
        },
    
        toString(){
            const out = [`${this.protocol}://${this.host}`];

            const defaultPort = this.protocol == 'https' ? 443 : 80;
            if(this.port != defaultPort){
                out.push(`:${this.port}`)
            }
    
            out.push(this.path)
    
            const pairs = []
            Object.keys(this.params).forEach((key) => {
                pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(this.params[key])}`)
            })
            if(pairs.length > 0){
                out.push(`?${pairs.join('&')}`)
            }
            
            return out.join('');
        }
    })
);

function normalizePath(path){
    const out = []
    path.split(/\//).forEach((segment) => {
        if(segment == '..'){
            out.pop()
        } else if(segment != '.'){
            out.push(segment);
        }
    })
    return out.join('/');
}
