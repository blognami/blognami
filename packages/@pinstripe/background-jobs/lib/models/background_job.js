
export default {
    meta(){
        this.belongsTo('tenant');
        this.belongsTo('backgroundJobWorker');

        this.mustNotBeBlank('jobName');
        this.mustNotBeBlank('status');
    }
};
