
import { ArgsParser } from "../args_parser.js";

export default {
    create(){
        return (...args) => ArgsParser.parseArgs([ ...this.args ], ...args);
    }
};
