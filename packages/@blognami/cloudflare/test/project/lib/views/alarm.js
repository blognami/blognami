// Reads the time the object's alarm is set for, or null with none set.
export default {
    async render(){
        return [200, { 'content-type': 'application/json' }, [JSON.stringify({
            alarm: await this.initialParams._cloudflare.DATABASE.getAlarm()
        })]];
    }
};
