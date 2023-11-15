
export default {
    meta(){
        this.include('pageable');

        this.hasMany('tagableTags');
        this.hasMany('tagables', { through: ['tagableTags', 'tagable'] });

        this.includeInTable({
            async toFieldValue(){
                return (await this.all()).map(({ name }) => name).sort().join("\n");
            }
        });
    }
};
