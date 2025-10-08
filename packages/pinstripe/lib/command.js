
import chalk from 'chalk';
import readline from 'readline';

import { Class } from './class.js';
import { inflector } from './inflector.js';
import { ImportableRegistry } from './importable_registry.js';
import { ServiceConsumer } from './service_consumer.js';
import { Validateable } from './validateable.js';
import { Annotatable } from './annotatable.js';


const optionPattern = /^-([a-z]|-[a-z\-]+)$/;

const COERCE_MAP = {
    string: items => items.join(' '),
    boolean: items => items.length ? items[0] === 'true' : true,
    number: items => Number(items[0] || 0),
};

export const Command = Class.extend().include({
    meta(){
        this.assignProps({ 
            name: 'Command'
        });

        this.include(ImportableRegistry);
        this.include(ServiceConsumer);
        this.include(Validateable);
        this.include(Annotatable);

        this.on('validation', async command => {
            // Validate unknown parameters
            for(const paramName of Object.keys(command.params)){
                // Skip global parameters that are built-in
                if(['help', 'h', 'interactive', 'i'].includes(paramName)) {
                    continue;
                }
                if(!command.constructor.params[paramName]){
                    command.setValidationError(paramName, `Unknown parameter`);
                }
            }
        });

        this.assignProps({
            normalizeName(name){
                return inflector.dasherize(name);
            },

            async run(context, name = 'list-commands', params = {}){
                await context.fork().run(async context => {
                    const Class = this.for(name);
                    context.params = Array.isArray(params) ? Class.coerceParams(Class.extractParams(params)) : params;
                    const command = Class.new(context);

                    if(context.params.help || context.params.h){
                        await command.showHelp();
                        return;
                    }

                    const paramsCount = Object.keys(context.params).length;
                    const requiredParamsCount = Object.values(Class.params).filter(p => !p.optional).length;
                    const missingRequired = paramsCount < requiredParamsCount;
                    const isExplicitlyInteractive = context.params.interactive || context.params.i;
                    const isInteractiveTerminal = process.stdin.isTTY && process.stdout.isTTY;
                    
                    if(isExplicitlyInteractive || (missingRequired && isInteractiveTerminal)){
                        await command.acquireParamsInteractively();
                    }

                    await command.validate();
                    await command.run();
                });
            },

            get params(){
                if(!this.hasOwnProperty('_params')){
                    this._params = {};
                }
                return this._params;
            },

            hasParam(name, options = {}){
                const { type = 'string', optional = false, ...otherParams } = options;

                this.params[name] = {
                    type,
                    optional,
                    ...otherParams
                };

                if(!optional) {
                    this.on('validation', command => {
                        if(command.isValidationError(name)) return;
                        const value = command.params[name];
                        if(!value) command.setValidationError(name, 'Must not be blank');
                    });
                }
            },

            extractParams(_args = []){
                const args = [ ..._args ];
                const out = {};
                let currentName;
                while(args.length){
                    const arg = args.shift();
                    const matches = arg.match(optionPattern);
                    if(matches){
                        currentName = inflector.camelize(matches[1]);
                        if(out[currentName] === undefined){
                            out[currentName] = [];
                        }
                    } else {
                        if(currentName === undefined){
                            currentName = 'args';
                            out[currentName] = [];
                        }
                        out[currentName].push(arg);
                    }
                }
                
                // Handle aliases - convert alias keys to their main parameter names
                for(const [name, { alias }] of Object.entries(this.params)){
                    if(!alias) continue;

                    const matches = alias.match(/^arg([0-9]+)$/);
                    if(matches){
                        const index = Number(matches[1]) - 1;
                        if(out.args && out.args.length > index){
                            out[name] = [ out.args[index] ];
                            delete out.args[index];
                        }
                    } else if(out[alias] !== undefined){
                        out[name] = out[alias];
                        delete out[alias];
                    }
                }

                if(out.args){
                    out.args = out.args.filter(Boolean);
                    if(!out.args.length) delete out.args;
                }
                
                return out;
            },

            coerceParams(params){
                const out = { ...params };
                for(const [name, { type }] of Object.entries(this.params)){
                    if(out[name] !== undefined){
                        const coerce = COERCE_MAP[type] || (v => v);
                        out[name] = coerce(out[name]);
                    }
                }
                return out;
            }
        });
    },

    get params(){
        return this.context?.params || {};
    },

    showHelp(){
        const { description = 'No description available.' } = this.constructor.annotations;
        const commandName = inflector.dasherize(this.constructor.name);
        const params = this.constructor.params || {};
        
        console.log('');
        console.log(chalk.bold(`${commandName} - ${description}`));
        console.log('');
        
        // Build usage line with argument and option syntax
        let usage = `Usage: ${chalk.cyan(commandName)}`;
        const paramNames = Object.keys(params);
        
        if (paramNames.length > 0) {
            const positionalArgs = [];
            const optionalOptions = [];
            const requiredOptions = [];
            
            // Categorize arguments and options
            for(const [name, param] of Object.entries(params)) {
                const { alias, optional = false, type = 'string' } = param;
                
                if(alias && alias.match(/^arg[0-9]+$/)) {
                    // Positional argument
                    const displayName = optional ? `[${name}]` : `<${name}>`;
                    positionalArgs.push(displayName);
                } else if(optional) {
                    // Optional option
                    const flag = alias ? `-${alias}, --${inflector.dasherize(name)}` : `--${inflector.dasherize(name)}`;
                    const typeHint = type === 'boolean' ? '' : ` <${type}>`;
                    optionalOptions.push(`[${flag}${typeHint}]`);
                } else {
                    // Required option
                    const flag = alias ? `-${alias}, --${inflector.dasherize(name)}` : `--${inflector.dasherize(name)}`;
                    const typeHint = type === 'boolean' ? '' : ` <${type}>`;
                    requiredOptions.push(`${flag}${typeHint}`);
                }
            }
            
            // Add arguments and options to usage line in order
            if(positionalArgs.length > 0) {
                usage += ' ' + positionalArgs.join(' ');
            }
            if(requiredOptions.length > 0) {
                usage += ' ' + requiredOptions.join(' ');
            }
            if(optionalOptions.length > 0) {
                usage += ' ' + optionalOptions.join(' ');
            }
        }
        
        // Always show help option
        usage += ' ' + chalk.dim('[--help]');
        console.log(usage);
        console.log('');
        
        // Show detailed arguments and options sections
        if(paramNames.length > 0) {
            // Group and sort arguments and options
            const positionalArgs = [];
            const requiredOptions = [];
            const optionalOptions = [];
            
            for(const [name, param] of Object.entries(params)) {
                const { alias, optional: isOptional = false, type = 'string', description = 'No description provided.' } = param;
                
                const paramInfo = {
                    name,
                    alias,
                    optional: isOptional,
                    type,
                    description
                };
                
                if(alias && alias.match(/^arg[0-9]+$/)) {
                    positionalArgs.push(paramInfo);
                } else if(isOptional) {
                    optionalOptions.push(paramInfo);
                } else {
                    requiredOptions.push(paramInfo);
                }
            }
            
            // Display arguments section
            if(positionalArgs.length > 0) {
                console.log(chalk.bold('Arguments:'));
                for(const param of positionalArgs) {
                    const { name, type, description, optional: isOptional } = param;
                    
                    // Build argument name display
                    const nameDisplay = chalk.green(name);
                    
                    // Build type and requirement display
                    const typeDisplay = chalk.dim(`[${type}]`);
                    const reqDisplay = isOptional ? chalk.dim('(optional)') : chalk.red('(required)');
                    
                    // Show argument line
                    console.log(`  ${nameDisplay} ${typeDisplay} ${reqDisplay}`);
                    console.log(`    ${description}`);
                    console.log(`    ${chalk.dim(`Usage: ${commandName} <value> ...`)}`);
                    console.log('');
                }
            }
            
            // Display options section
            const allOptions = [...requiredOptions, ...optionalOptions];
            if(allOptions.length > 0) {
                console.log(chalk.bold('Options:'));
                for(const param of allOptions) {
                    const { name, alias, optional: isOptional, type, description } = param;
                    
                    // Build option name display
                    let nameDisplay = chalk.green(name);
                    if(alias && !alias.match(/^arg[0-9]+$/)) {
                        nameDisplay += ` (${chalk.yellow(`-${alias}`)})`;
                    }
                    
                    // Build type and requirement display
                    const typeDisplay = chalk.dim(`[${type}]`);
                    const reqDisplay = isOptional ? chalk.dim('(optional)') : chalk.red('(required)');
                    
                    // Show option line
                    console.log(`  ${nameDisplay} ${typeDisplay} ${reqDisplay}`);
                    console.log(`    ${description}`);
                    
                    // Show CLI usage examples
                    const flag = alias ? `-${alias}` : `--${inflector.dasherize(name)}`;
                    if(type === 'boolean') {
                        console.log(`    ${chalk.dim(`Usage: ${commandName} ${flag}`)}`);
                    } else {
                        console.log(`    ${chalk.dim(`Usage: ${commandName} ${flag} <${type}>`)}`);
                    }
                    console.log('');
                }
            }
        }
        
        // Always show global options
        console.log(chalk.bold('Global Options:'));
        console.log(`  ${chalk.green('help')} (${chalk.yellow('-h')}) ${chalk.dim('[boolean]')} ${chalk.dim('(optional)')}`);
        console.log(`    Show this help message`);
        console.log(`    ${chalk.dim(`Usage: ${commandName} --help`)}`);
        console.log('');
        console.log(`  ${chalk.green('interactive')} (${chalk.yellow('-i')}) ${chalk.dim('[boolean]')} ${chalk.dim('(optional)')}`);
        console.log(`    Prompt for all parameters interactively`);
        console.log(`    ${chalk.dim(`Usage: ${commandName} --interactive`)}`);
        console.log('');
    },

    async acquireParamsInteractively(){
        const paramsToAcquire = this.constructor.params;
        const commandName = this.constructor.name;
        
        console.log('');
        console.log(chalk.bold(`Interactive setup for ${chalk.cyan(commandName)}`));
        console.log('');
        
        // Process each parameter that needs a value
        for(const [paramName, paramConfig] of Object.entries(paramsToAcquire)){
            const { type = 'string', optional = false, description = '', alias } = paramConfig;
            
            // Skip if we already have a value for this parameter
            if(this.params[paramName] !== undefined) {
                continue;
            }
            
            // For required parameters, always prompt
            // For optional parameters, only prompt if explicitly in interactive mode
            const isExplicitlyInteractive = this.params.interactive || this.params.i;
            if(optional && !isExplicitlyInteractive) {
                continue; // Skip optional params unless explicitly in interactive mode
            }
            
            // Build the prompt
            let prompt = chalk.green(paramName);
            if(alias && !alias.match(/^arg[0-9]+$/)) {
                prompt += chalk.dim(` (-${alias})`);
            }
            prompt += chalk.dim(` [${type}]`);
            if(optional) {
                prompt += chalk.dim(' (optional)');
            }
            if(description) {
                prompt += chalk.dim(` - ${description}`);
            }
            prompt += ': ';
            
            // Get user input
            const value = await promptForValue(prompt, type, optional);
            
            // Store the value if provided
            if(value !== null) {
                // Store as array format (like extractParams returns) so coerceParams can process it
                this.params[paramName] = type === 'boolean' ? [value.toString()] : [value];
            }
        }
        
        // Coerce all the parameters to their correct types
        const coercedParams = this.constructor.coerceParams(this.params);
        
        // Update the context params with the coerced values
        Object.assign(this.context.params, coercedParams);
        
        console.log('');
    },

    run(){
        throw new Error(`No such command "${this.constructor.name}" exists.`);
    }
});

async function promptForValue(prompt, type, optional) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question(prompt, (answer) => {
            rl.close();
            
            // Handle empty input
            if (!answer.trim()) {
                if (optional) {
                    resolve(null); // No value for optional param
                } else {
                    // Required param, ask again
                    console.log(chalk.red('  This parameter is required.'));
                    resolve(promptForValue(prompt, type, optional));
                    return;
                }
            } else {
                // Validate based on type
                const trimmedAnswer = answer.trim();
                
                if (type === 'number') {
                    const num = Number(trimmedAnswer);
                    if (isNaN(num)) {
                        console.log(chalk.red('  Please enter a valid number.'));
                        resolve(promptForValue(prompt, type, optional));
                        return;
                    }
                    resolve(trimmedAnswer);
                } else if (type === 'boolean') {
                    const lowerAnswer = trimmedAnswer.toLowerCase();
                    if (['true', 'false', 't', 'f', 'yes', 'no', 'y', 'n', '1', '0'].includes(lowerAnswer)) {
                        const boolValue = ['true', 't', 'yes', 'y', '1'].includes(lowerAnswer);
                        resolve(boolValue);
                    } else {
                        console.log(chalk.red('  Please enter true/false, yes/no, or y/n.'));
                        resolve(promptForValue(prompt, type, optional));
                        return;
                    }
                } else {
                    // string type or unknown type - accept as-is
                    resolve(trimmedAnswer);
                }
            }
        });
    });
}
