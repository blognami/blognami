
import chalk from 'chalk';

import { AbstractImportableRegistry } from './abstract_importable_registry.js';
import { Validatable } from './validatable.js';
import { Annotatable } from './annotatable.js';
import { inflector } from './inflector.js';

const optionPattern = /^-([a-z]|-[a-z\-]+)$/;

const COERCE_MAP = {
    string: items => items.join(' '),
    boolean: items => items.length ? items[0] === 'true' : true,
    number: items => Number(items[0] || 0),
    fields: items => {
        const fieldsString = items.join(' ');
        return fieldsString.split(/\s+/).map(field => field.trim()).filter(field => field).map(arg => {
            const matches = arg.match(/^(\^|)([^:]*)(:|)(.*)$/);
            const mandatory = matches[1] == '^';
            const name = inflector.camelize(matches[2]);
            const type = matches[4] || 'string';
            return { mandatory, name, type };
        });
    },
};

export const AbstractCommand = {
    meta(){
        this.assignProps({
            binaryName: 'command'
        });

        this.include(AbstractImportableRegistry);
        this.include(Validatable);
        this.include(Annotatable);

        this.addHook('validation', async function(){
            for(const paramName of Object.keys(this.params)){
                if(['help', 'h', 'interactive', 'i'].includes(paramName)) {
                    continue;
                }
                if(!this.constructor.params[paramName]){
                    this.setValidationError(paramName, `Unknown parameter`);
                }
            }
        });

        this.register('list-commands', {
            meta(){
                this.assignProps({
                    description: 'Lists all available commands and shows how to get help for specific commands.'
                });
            },

            run(){
                const CommandHost = this.constructor.registry;
                console.log('');
                console.log('The following commands are available:');
                console.log('');
                CommandHost.names.forEach(commandName => {
                    console.log(`  * ${chalk.green(commandName)}`);
                });
                console.log('');
                console.log('For more information on a specific command, run:');
                console.log('');
                console.log(chalk.cyan(`  ${CommandHost.binaryName} COMMAND_NAME --help`));
                console.log('');
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
                    this.addHook('validation', function(){
                        if(this.isValidationError(name)) return;
                        const value = this.params[name];
                        if(!value) this.setValidationError(name, 'Must not be blank');
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
        const { description = 'No description available.' } = this.constructor;
        const commandName = inflector.dasherize(this.constructor.name);
        const params = this.constructor.params || {};

        console.log('');
        console.log(chalk.bold(`${commandName} - ${description}`));
        console.log('');

        let usage = `Usage: ${chalk.cyan(commandName)}`;
        const paramNames = Object.keys(params);

        if (paramNames.length > 0) {
            const positionalArgs = [];
            const optionalOptions = [];
            const requiredOptions = [];

            for(const [name, param] of Object.entries(params)) {
                const { alias, optional = false, type = 'string' } = param;

                if(alias && alias.match(/^arg[0-9]+$/)) {
                    const displayName = optional ? `[${name}]` : `<${name}>`;
                    positionalArgs.push(displayName);
                } else if(optional) {
                    const flag = alias ? `-${alias}, --${inflector.dasherize(name)}` : `--${inflector.dasherize(name)}`;
                    const typeHint = type === 'boolean' ? '' : ` <${type}>`;
                    optionalOptions.push(`[${flag}${typeHint}]`);
                } else {
                    const flag = alias ? `-${alias}, --${inflector.dasherize(name)}` : `--${inflector.dasherize(name)}`;
                    const typeHint = type === 'boolean' ? '' : ` <${type}>`;
                    requiredOptions.push(`${flag}${typeHint}`);
                }
            }

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

        usage += ' ' + chalk.dim('[--help]');
        console.log(usage);
        console.log('');

        if(paramNames.length > 0) {
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

            if(positionalArgs.length > 0) {
                console.log(chalk.bold('Arguments:'));
                for(const param of positionalArgs) {
                    const { name, type, description, optional: isOptional } = param;

                    const nameDisplay = chalk.green(name);
                    const typeDisplay = chalk.dim(`[${type}]`);
                    const reqDisplay = isOptional ? chalk.dim('(optional)') : chalk.red('(required)');

                    console.log(`  ${nameDisplay} ${typeDisplay} ${reqDisplay}`);
                    console.log(`    ${description}`);
                    console.log(`    ${chalk.dim(`Usage: ${commandName} <value> ...`)}`);
                    console.log('');
                }
            }

            const allOptions = [...requiredOptions, ...optionalOptions];
            if(allOptions.length > 0) {
                console.log(chalk.bold('Options:'));
                for(const param of allOptions) {
                    const { name, alias, optional: isOptional, type, description } = param;

                    let nameDisplay = chalk.green(name);
                    if(alias && !alias.match(/^arg[0-9]+$/)) {
                        nameDisplay += ` (${chalk.yellow(`-${alias}`)})`;
                    }

                    const typeDisplay = chalk.dim(`[${type}]`);
                    const reqDisplay = isOptional ? chalk.dim('(optional)') : chalk.red('(required)');

                    console.log(`  ${nameDisplay} ${typeDisplay} ${reqDisplay}`);
                    console.log(`    ${description}`);

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

        for(const [paramName, paramConfig] of Object.entries(paramsToAcquire)){
            const { type = 'string', optional = false, description = '', alias } = paramConfig;

            if(this.params[paramName] !== undefined) {
                continue;
            }

            const isExplicitlyInteractive = this.params.interactive || this.params.i;
            if(optional && !isExplicitlyInteractive) {
                continue;
            }

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

            const value = await promptForValue(prompt, type, optional);

            if(value !== null) {
                this.params[paramName] = type === 'boolean' ? [value.toString()] : [value];
            }
        }

        const coercedParams = this.constructor.coerceParams(this.params);

        Object.assign(this.context.params, coercedParams);

        console.log('');
    },

    run(){
        throw new Error(`No such command "${this.constructor.name}" exists.`);
    }
};

async function promptForValue(prompt, type, optional) {
    const readline = await import('node:readline');
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(prompt, (answer) => {
            rl.close();

            if (!answer.trim()) {
                if (optional) {
                    resolve(null);
                } else {
                    console.log(chalk.red('  This parameter is required.'));
                    resolve(promptForValue(prompt, type, optional));
                    return;
                }
            } else {
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
                    resolve(trimmedAnswer);
                }
            }
        });
    });
}
