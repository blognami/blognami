
export default {
    create(){
        return slug => {
            const errors = [];

            if(typeof slug !== 'string' || slug.length === 0){
                errors.push('Subdomain is required.');
                return errors;
            }

            if(slug.length < 3){
                errors.push('Subdomain must be at least 3 characters.');
            }

            if(slug.length > 63){
                errors.push('Subdomain must be 63 characters or fewer.');
            }

            if(/[A-Z]/.test(slug)){
                errors.push('Subdomain must be lowercase.');
            }

            if(/[^a-z0-9-]/.test(slug)){
                errors.push('Subdomain can only contain lowercase letters, numbers, and hyphens.');
            }

            if(slug.startsWith('-')){
                errors.push('Subdomain must not start with a hyphen.');
            }

            if(slug.endsWith('-')){
                errors.push('Subdomain must not end with a hyphen.');
            }

            if(errors.length === 0 && this.reservedSubdomains.includes(slug)){
                errors.push(`"${slug}" is a reserved name and cannot be used.`);
            }

            return errors;
        };
    }
};
