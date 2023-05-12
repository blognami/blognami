
export default {
    async render(){
        let user;
        if(await this.session){
            user = await this.session.user;
        }
    
        if(!user || user.role != 'admin'){
            const [ status, headers, body ] = await this.renderHtml`
                <div class="modal" data-component="a" data-target="_top" data-ignore-events-from-children="true">
                    <button data-component="a" data-target="_top"></button>
                    <div class="card">
                        <div class="card-header">
                            <p class="card-header-title">Access denied</p>
                        </div>
                        <div class="card-body">
                            <p>You need to be an &quot;admin&quot; user to do this.</p>
                        </div>
                        <div class="card-footer">
                            <button class="button is-primary" data-component="a" data-target="_top">OK</button>
                        </div>
                    </div>
                </div>
            `.toResponseArray();
    
            return [403, headers, body];
        }
    }
}
