export default {
    create(){
        return this.defer(async () => !(await this.user));
    }
};