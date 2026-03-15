export default {
    meta(){
        this.include('pageable');
        this.mustNotBeBlank('file');
        this.addHook('validation', function(){
            if(!this.file) return;
            if(!this.isValidationError('file') && !this.file.filename) this.setValidationError('file', 'Must have a filename');
            if(!this.isValidationError('file') && typeof this.file.mimeType != 'string') this.setValidationError('file', 'Must have a mime type');
            if(!this.isValidationError('file') && !this.file.data) this.setValidationError('file', 'Must have data');
            if(!this.isValidationError('file') && !this.file.mimeType.match(/^image\/(png|jpeg|gif|svg|webp|avif|tiff)$/)) this.setValidationError('file',  `Must be png, jpeg, gif, svg, webp, avif or tiff`);
        });
        this.addHook('beforeInsert', async function(){
            if(!this._fileData) return;
            const blobStore = await this.workspace.blobStore;
            this.blobId = await blobStore.put(this._fileData);
        });
        this.addHook('beforeDelete', async function(){
            if(!this.blobId) return;
            const blobStore = await this.workspace.blobStore;
            await blobStore.delete(this.blobId);
        });
    },

    get data(){
        return this.workspace.defer(async () => (await this.workspace.blobStore).get(this.blobId));
    },

    get file(){
        if(this.hasOwnProperty('_file')) return this._file;
        return { filename: this.title, mimeType: `image/${this.type}`, data: this._fileData };
    },

    set file(file){
        this._file = file;
        if(typeof file != 'object') return;
        const { filename, mimeType, data } = file;
        this.title = filename;
        this.type = mimeType?.match(/^image\/(.+)$/)?.[1];
        this._fileData = data;
    }
};