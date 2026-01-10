
export default {
    meta(){
        this.belongsTo('backgroundJobWorker');

        this.scope('pending', function(){
            return this.where({ status: 'pending' });
        });

        this.scope('processing', function(){
            return this.where({ status: 'processing' });
        });

        this.scope('ready', function(){
            this.where({ pending: true, runAtLe: new Date() });
        });
    },

    async markProcessing(backgroundJobWorkerId){
        return this.update({
            status: 'processing',
            backgroundJobWorkerId,
            claimedAt: new Date()
        });
    },

    async markPending(){
        const attempts = this.attempts + 1;
        const backoffSeconds = Math.pow(2, attempts);
        const jitterMs = Math.random() * 1000;
        const runAt = new Date(Date.now() + backoffSeconds * 1000 + jitterMs);

        return this.update({
            status: 'pending',
            backgroundJobWorkerId: null,
            claimedAt: null,
            attempts,
            runAt
        });
    },

    async release(){
        return this.update({
            status: 'pending',
            backgroundJobWorkerId: null,
            claimedAt: null
        });
    }
};
