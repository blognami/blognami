
export default {
    render(){
        return [200, { 'content-type': 'application/json' }, [JSON.stringify({ IS_SERVER: this.engine.IS_SERVER, isClient: this.isClient })]];
    }
};
