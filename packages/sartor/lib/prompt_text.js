
import { Text } from 'haberdash';
import { Playbook } from './playbook.js';

export const PromptText = Text.extend('PromptText').include({
    meta(){
        const { dslProps } = this;
        this.assignProps({ dslProps: [...dslProps, 'playbooks'] });
    },

    playbooks(){
        const names = Playbook.names;
        if(names.length === 0) return;

        const indexPaths = names.map(name => Playbook.for(name).latestFilePath);

        this.line('## Read the playbooks first — mandatory');
        this.line();
        this.line('Before doing anything else — before replying to the user, before any other action — you **must** read every file below, in full:');
        this.line();
        for(const p of indexPaths) this.line(`- \`${p}\``);
        this.line();
        this.line('These playbooks govern the session. Follow their instructions. Load sibling files only when a playbook tells you to.');
    }
});
