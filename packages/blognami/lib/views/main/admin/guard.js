
export default {
    async render(){
        let user;
        if(await this.session){
            user = await this.session.user;
        }
    
        if(!user || user.role != 'admin'){
            const [ status, headers, body ] = await this.renderHtml`
                <pinstripe-modal>
                    <div class="card">
                        <div class="card-header">
                            <p class="card-header-title">Access denied</p>
                        </div>
                        <div class="card-body">
                            <p>You need to be an &quot;admin&quot; user to do this.</p>
                        </div>
                        <div class="card-footer">
                            <button class="button is-primary">
                                OK
                                <script type="pinstripe">
                                    this.parent.on('click', () => this.trigger('close'));
                                </script>
                            </button>
                        </div>
                    </div>
                </pinstripe-modal>
            `.toResponseArray();
    
            return [403, headers, body];
        }
    }
}
