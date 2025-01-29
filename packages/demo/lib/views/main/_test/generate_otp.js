
export default {
    async render(){
        const { email } = this.params;
        const user = await this.database.users.where({ email }).first();
        if(!user){
            return [200, {'content-type': 'text/json'}, [JSON.stringify({
                otp: await this.database.site.generatePassword(email)
            })]];
        }

        return [200, {'content-type': 'text/json'}, [JSON.stringify({
            otp: await user.generatePassword()
        })]];
    }
};
