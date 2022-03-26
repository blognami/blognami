
import { NodeWrapper } from '../node_wrapper.js';

export default () => {
    return Object.keys(NodeWrapper.classes).sort();
};
