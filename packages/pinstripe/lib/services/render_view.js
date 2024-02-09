
export default {
    create(){
        return (name, params = {}) => this.app.renderView(name, params);
    }
};
