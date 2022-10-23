
export default {
    meta(){
        this.include('pageable');
    },

    set file(file){
        const { filename, mimeType, data } = file;
        const matches = mimeType.match(/^image\/(.+)$/);
        if(matches){
            this.title = filename;
            this.type = matches[1];
            this.data = data;
        }
    }
};
