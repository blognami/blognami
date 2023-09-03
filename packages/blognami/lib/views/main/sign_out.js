
export default {
    async render(){
        if(await this.session){
            await this.session.delete();
        }
    
        const [ status, headers, body ] = await this.renderHtml`
            <span data-component="a" data-target="_top">
                <script type="blognami">
                    this.parent.trigger('click');
                </script>
            </span>
        `.toResponseArray();
    
        headers['Set-Cookie'] = 'blognamiSession=';
    
        return [ status, headers, body ];
    }
};
