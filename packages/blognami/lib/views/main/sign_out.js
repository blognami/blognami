
export default {
    async render(){
        if(await this.session){
            await this.session.delete();
        }
    
        const [ status, headers, body ] = await this.renderHtml`
            <span data-component="a" data-target="_top">
                <script type="pinstripe">
                    this.parent.trigger('click');
                </script>
            </span>
        `.toResponseArray();
    
        headers['Set-Cookie'] = 'haberdashSession=';
    
        return [ status, headers, body ];
    }
};
