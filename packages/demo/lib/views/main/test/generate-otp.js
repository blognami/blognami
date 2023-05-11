
export default {
    async render(){
        const { email } = this.params;
        const user = await this.database.users.where({ email }).first();
        if(!user){
            return [404, {'content-type': 'text/json'}, [ JSON.stringify({
                message: `Not such user with email "${email}"`
            }) ]];
        }

        return [200, {'content-type': 'text/json'}, [JSON.stringify({
            otp: await user.generatePassword()
        })]];
    }
};
