
export default {
    async render(){
        const { name, value } = await this.database.revisions.where({ id: this.params.id }).first();

        return this.renderHtml`
            <script type="pinstripe">
                const { name, value } = ${this.renderHtml(JSON.stringify({ name, value }))};
                this.form.inputs.forEach(input => {
                    if(input.name == name){
                        input.value = value;
                    }
                });
                this.overlay.overlay.remove();
            </script>
        `;
    }
};