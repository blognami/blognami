import { Agent, PromptText } from 'cardoon';

export default {
    create(){
        return this.defer(async () => this.context.root.getOrCreate('agent', async () => {
            const config = await this.config;
            const defaultProvider = config.agent?.provider ?? 'claude';
            const context = this.context;
            const instances = new Map();
            const render = async value => typeof value == 'function' ? (await PromptText.render(value)).toString() : (value ?? '');
            return {
                async run(options = {}) {
                    const { provider = defaultProvider, systemPrompt, prompt, ...rest } = options;
                    if (!instances.has(provider)) {
                        instances.set(provider, Agent.create(provider, context));
                    }
                    return instances.get(provider).run({
                        ...rest,
                        systemPrompt: systemPrompt == null ? undefined : await render(systemPrompt),
                        prompt: await render(prompt),
                    });
                }
            };
        }));
    }
};
