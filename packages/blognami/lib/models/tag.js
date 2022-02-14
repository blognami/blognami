
export default {
    meta(){
        this.include('pageable');

        this.hasMany('tagableTags');
        this.hasMany('tagables', { through: ['tagableTags', 'tagable'] });

        this.tableClass.include({
            async toFieldValue(){
                const out = [];
                await this.orderBy('name').forEach(({ name }) => {
                    out.push(name);
                });
                return out.join("\n");
            }
        });
    }
};
