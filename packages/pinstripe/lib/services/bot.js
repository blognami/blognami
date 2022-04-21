
import cronParser from 'cron-parser';

import { Command } from '../command.js';

export default {

    meta(){
        this.scope = 'root';
    },

    start(){
        if(this._loop) this._loop;

        this._loop = new Promise(async resolve => {
            let current = getUnixTime();
            while(true){
                const target = getUnixTime();
                while(current < target){
                    current++;
                    await this.runCommands(current);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));

                if(!this._loop) break;
            }

            resolve();
        });
        
        return this._loop;
    },

    async stop(){
        const loop = this._loop;
        delete this._loop;
        await loop;
    },

    async runCommands(unixTime){
        const currentDate = new Date(unixTime * 1000);
        const endDate = new Date((unixTime + 1) * 1000);
        const commands = Object.values(Command.classes);
        while(commands.length){
            const command = commands.shift();
            const schedules = [ ...command.schedules ];
            while(schedules.length){
                const [ crontab, ...args ] = schedules.shift();
                const interval = cronParser.parseExpression(crontab, {
                    currentDate,
                    endDate
                }); 
                
                if(interval.hasNext()){
                    await this.runCommand(command.name, ...args);
                }
            }
        }
    },

    

    destroy(){
        return this.stop();
    }

};

const getUnixTime = () => Math.floor(Date.now() / 1000);