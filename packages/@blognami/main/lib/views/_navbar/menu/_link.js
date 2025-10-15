export default {
    render(){
        const { url, target, label } = this.params;
        
        return this.renderHtml`
            <a href="${url}" target="${target}">${label}</a>
        `;
    }
};