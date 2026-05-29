
import { Text } from 'haberdash';

Text.include({
    toResponseArray(status = 200, headers = {}){
        return [status, {'content-type': 'text/plain', ...headers}, [this.toString().trim()]];
    }
});

export { Text };
