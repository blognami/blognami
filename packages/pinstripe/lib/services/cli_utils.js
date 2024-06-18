export default {
    create(){
        return {
            normalizeFields: fields => {
                let out = fields;
                if(typeof out == 'string') out = out.split(/\s+/).map(field => field.trim()).filter(field => field).map(arg => {
                    const matches = arg.match(/^(\^|)([^:]*)(:|)(.*)$/);
                    const mandatory = matches[1] == '^';
                    const name = this.inflector.camelize(matches[2]);
                    const type =  matches[4];
                    return {
                        mandatory,
                        name,
                        type
                    };
                });
                out.forEach(field => {
                    field.mandatory ??= false;
                    field.type ||= 'string';
                });
                return out;
            }
        };
    }
};