export const importOptionalPackage = async specifier => {
    try {
        return await import(specifier);
    } catch(error) {
        if(error.code == 'ERR_MODULE_NOT_FOUND' && error.message.startsWith(`Cannot find package '${specifier}' `)) return;
        throw error;
    }
};
