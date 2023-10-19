

import cronParser from 'cron-parser';

import { Command } from '../command.js';

export default {
    create(){
        return this;
    },
    
    start(){
        if(this.loop) return this.loop;

        this.loop = new Promise(async resolve => {
            let current = getUnixTime();
            while(true){
                const target = getUnixTime();
                while(current < target){
                    current++;
                    await this.runCommands(current);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));

                if(!this.loop) break;
            }

            resolve();
        });
        
        return this.loop;
    },

    async stop(){
        const loop = this.loop;
        delete this.loop;
        await loop;
    },

    async runCommands(unixTime){
        const currentDate = new Date(unixTime * 1000);
        const endDate = new Date((unixTime + 1) * 1000);
        const commands = Command.names.map(name => Command.for(name));
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
