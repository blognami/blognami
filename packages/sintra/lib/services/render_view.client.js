
export default {
    create(){
        return async (...args) => this.app.renderView(...args);
    }
};
