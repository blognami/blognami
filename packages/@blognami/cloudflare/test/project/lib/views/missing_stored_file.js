// Names a stored file the static assets binding does not hold.
const STORED_PATH = 'proof/missing.txt';

export default {
    render(){
        return [200, { 'content-type': 'text/plain', [this.engine.STATIC_ASSET_HEADER]: encodeURI(STORED_PATH) }, []];
    }
};
