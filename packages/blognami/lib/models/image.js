
export default {
    meta(){
        this.include('pageable');
        this.mustNotBeBlank('file');
        this.validateWith(function(){
            if(!this.file) return;
            if(!this.isValidationError('file') && !this.file.filename) this.setValidationError('file', 'Must have a filename');
            if(!this.isValidationError('file') && typeof this.file.mimeType != 'string') this.setValidationError('file', 'Must have a mime type');
            if(!this.isValidationError('file') && !this.file.data) this.setValidationError('file', 'Must have data');
            if(!this.isValidationError('file') && !this.file.mimeType.match(/^image\/(png|jpeg|gif|svg|webp|avif|tiff)$/)) this.setValidationError('file',  `Must be png, jpeg, gif, svg, webp, avif or tiff`);
        })
    },

    get file(){
        if(this.hasOwnProperty('_file')) return this._file;
        return { filename: this.title, mimeType: `image/${type}`, data: this.data };
    },

    set file(file){
        this._file = file;
        if(typeof file != 'object') return;
        const { filename, mimeType, data } = file;
        this.title = filename;
        this.type = mimeType?.match(/^image\/(.+)$/)?.[1];
        this.data = data;
    }
};
