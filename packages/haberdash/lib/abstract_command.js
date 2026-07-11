
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
                if(!this.constructor.params[paramName]){
                    this.setValidationError(paramName, `Unknown parameter`);
                }
            }
        });

        const listCommands = this.createListCommand({
            noun: 'commands',
            after({ registry }){
                console.log('For more information on a specific command, run:');
                console.log('');
                console.log(chalk.cyan(`  ${registry.binaryName} COMMAND_NAME --help`));
            }
        });

        this.register('list-commands', {
            meta(){
                this.include(listCommands);
            }
        });

        this.assignProps({
            normalizeName(name){
                return inflector.dasherize(name);
            },

            async run(context, name, params = {}){
                if(name === undefined){
                    name = 'list-commands';
                } else if(!this.mixins[this.normalizeName(name)]){
                    if(Array.isArray(params)) params = [name, ...params];
                    name = 'list-commands';
                }
                await context.fork().run(async context => {
                    const Class = this.for(name);
                    context.params = Array.isArray(params) ? Class.coerceParams(Class.extractParams(params)) : params;
                    const command = Class.new(context);

                    if(context.params.help){
                        await command.showHelp();
                        return;
                    }

                    const paramsCount = Object.keys(context.params).length;
                    const requiredParamsCount = Object.values(Class.params).filter(p => !p.optional).length;
                    const missingRequired = paramsCount < requiredParamsCount;
                    const isExplicitlyInteractive = context.params.interactive;
                    const isInteractiveTerminal = process.stdin.isTTY && process.stdout.isTTY;

                    if(isExplicitlyInteractive || (missingRequired && isInteractiveTerminal)){
                        await command.acquireParamsInteractively();
                    }

                    await command.validate();
                    await command.run();
                });
            },

            // Merged copy of this class's own params and every ancestor's,
            // root-first so own declarations override inherited ones.
            get params(){
                const chain = [];
                let current = this;
                while(current){
                    if(current.hasOwnProperty('_params')) chain.unshift(current._params);
                    current = Object.getPrototypeOf(current);
                }
                return Object.assign({}, ...chain);
            },

            hasParam(name, options = {}){
                const { type = 'string', optional = false, ...otherParams } = options;

                if(!this.hasOwnProperty('_params')){
                    this._params = {};
                }

                this._params[name] = {
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

        this.hasParam('help', {
            type: 'boolean',
            optional: true,
            alias: 'h',
            excludeFromInteractiveMode: true,
            description: 'Show this help message'
        });

        this.hasParam('interactive', {
            type: 'boolean',
            optional: true,
            alias: 'i',
            excludeFromInteractiveMode: true,
            description: 'Prompt for all parameters interactively'
        });
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
    },

    async acquireParamsInteractively(){
        const paramsToAcquire = this.constructor.params;
        const commandName = this.constructor.name;

        console.log('');
        console.log(chalk.bold(`Interactive setup for ${chalk.cyan(commandName)}`));
        console.log('');

        for(const [paramName, paramConfig] of Object.entries(paramsToAcquire)){
            const { type = 'string', optional = false, description = '', alias, excludeFromInteractiveMode = false } = paramConfig;

            if(excludeFromInteractiveMode) {
                continue;
            }

            if(this.params[paramName] !== undefined) {
                continue;
            }

            const isExplicitlyInteractive = this.params.interactive;
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
