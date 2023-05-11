
export default {
    create(){
        return (...args) => this.app.renderView(...args);
    }
};
