
import { Playbook } from 'cardoon';

export default {
    meta(){
        this.include(Playbook.createListCommand({ noun: 'playbooks' }));
        this.tag('playbook');
    }
};
