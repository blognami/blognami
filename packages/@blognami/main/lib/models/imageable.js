export default {
    meta(){
        this.assignProps({
            get imageFields(){
                if(!this._imageFields){
                    this._imageFields = [];
                }
                return this._imageFields
            },

            addImageField(name){
                this.imageFields.push(name);
            }
        });

        this.addHook('validation', async function(){
            for(const name of this.constructor.imageFields) await this.validatePendingImage(name);
        });

        this.addHook('beforeUpdate', function(){
            for(const name of this.constructor.imageFields) this.applyPendingImage(name);
        });

        this.addHook('afterUpdate', async function(){
            for(const name of this.constructor.imageFields){
                await this.insertPendingImage(name);
                await this.deletePreviousImage(name);
            }
        });
    },

    buildPendingImage(name, file){
        if(!file?.filename || !file?.data) return;
        this[`_${name}Image`] = this.constructor.create('image', this.database, { file });
    },

    async validatePendingImage(name){
        const image = this[`_${name}Image`];
        if(!image) return;
        try {
            await image.validate();
        } catch(e) {
            if(!image.isValidationError()) throw e;
        }
        if(image.isValidationError('file')) this.setValidationError(name, image.validationErrors.file);
    },

    applyPendingImage(name){
        const Name = this.workspace.inflector.capitalize(name);
        this[`_previous${Name}ImageId`] = this._initialFields[`${name}ImageId`];
        if(this[`_${name}Image`]) this[`${name}ImageId`] = this[`_${name}Image`].id;
        else if(this[`_remove${Name}`]) this[`${name}ImageId`] = null;
    },

    async insertPendingImage(name){
        const Name = this.workspace.inflector.capitalize(name);
        const image = this[`_${name}Image`];
        delete this[`_${name}Image`];
        delete this[`_remove${Name}`];
        if(image) await image.update();
    },

    async deletePreviousImage(name){
        const Name = this.workspace.inflector.capitalize(name);
        const previousImageId = this[`_previous${Name}ImageId`];
        if(!previousImageId || previousImageId == this[`${name}ImageId`]) return;
        const previousImage = await this.database.images.where({ id: previousImageId }).first();
        if(previousImage) await previousImage.delete();
    },
};
