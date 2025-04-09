
export default {
    async render(){
        if(await this.session){
            await this.session.delete();
        }
    
        const [ status, headers, body ] = await this.renderHtml`
            <span data-component="pinstripe-anchor" data-target="_top">
                <script type="pinstripe">
                    this.parent.trigger('click');
                </script>
            </span>
        `.toResponseArray();
    
        headers['Set-Cookie'] = 'sintraSession=';
    
        return [ status, headers, body ];
    }
};
