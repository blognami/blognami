
export default {
    render(){
        if(this.params._headers['x-app']) return;
        return [403, {'content-type': 'text/plain'}, ['Access denied']]
    }
};
