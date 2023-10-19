
export class ValidationError extends Error {
    constructor(errors = {}) {
        super(JSON.stringify(errors));
        this.errors = errors
    }
}
