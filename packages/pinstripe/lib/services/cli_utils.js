
const optionPattern = /^-([a-z]|-[a-z\-]+)$/;

export default ({ args: _args, camelize }) => {
    let args = [..._args];

    const extractArg = (_default) => {
        if(args[0] && !args[0].match(optionPattern)){
            return args.shift();
        }
        return _default;
    };

    const extractArgs = () => {
        const out = [];
        while(args[0] && !args[0].match(optionPattern)){
            out.push(args.shift())
        }
        return out;
    };

    const extractFields = () => extractArgs().map(arg => {
        const matches = arg.match(/^(\^|)([^:]*)(:|)(.*)$/);
        const mandatory = matches[1] == '^';
        const name = camelize(matches[2]);
        const type =  matches[4] || 'string';
        return {
            mandatory,
            name,
            type
        };
    });

    const extractOptions = (_default = {}) => {
        const out = {};
        let currentName;
        while(args.length){
            const arg = args.shift();
            const matches = arg.match(optionPattern);
            if(matches){
                currentName = camelize(matches[1]);
                if(out[currentName] === undefined){
                    out[currentName] = [];
                }
            } else if(currentName){
                out[currentName].push(arg);
            }
        }
        Object.keys({ ...out, ..._default }).forEach(name => {
            const value = out[name];
            if(value === undefined){
                out[name] = _default[name];
            } else if(!value.length){
                out[name] = true;
            } else if(!Array.isArray(_default[name])){
                out[name] = value.join(' ');
            }
        });
        return out;
    };

    const resetArgs = () => args = [..._args];

    return {
        extractArg,
        extractArgs,
        extractFields,
        extractOptions,
        resetArgs
    };
};
