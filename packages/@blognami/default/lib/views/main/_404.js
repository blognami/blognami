
export default {
    async render(){
        const [ status, headers, body ] = (await this.renderView('_layout', {
            title: 'Not found',
            body: this.renderView('_section', {
                title: 'Not found',
                body: this.renderHtml`
                    <p>The page you are looking for can't be found or no longer exists.</p>
                `
            })
        })).toResponseArray();
    
        return [ 404, headers, body ];
    }
}