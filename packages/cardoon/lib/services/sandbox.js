import { Sandbox } from 'cardoon';

export default {
    create(){
        return this.defer(async () => this.context.root.getOrCreate('sandbox', async () => {
            const config = await this.config;
            return Sandbox.create(config.sandbox?.provider ?? 'docker', this.context);
        }));
    }
};
