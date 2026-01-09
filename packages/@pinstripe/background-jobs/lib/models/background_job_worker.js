
export default {
    meta(){
        this.hasMany('backgroundJobs');

        this.mustNotBeBlank('instanceId');
        this.mustNotBeBlank('status');
    }
};
