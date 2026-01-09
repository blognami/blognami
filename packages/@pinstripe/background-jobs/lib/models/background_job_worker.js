
export default {
    meta(){
        this.hasMany('backgroundJobs');

        this.scope('active', function(){
            return this.where({ status: 'active' });
        });

        this.scope('alive', function(){
            const thirtySecondsAgo = new Date(Date.now() - 30000);
            return this.where({ lastHeartbeatAtGt: thirtySecondsAgo });
        });

        this.scope('dead', function(){
            const thirtySecondsAgo = new Date(Date.now() - 30000);
            return this.where({ lastHeartbeatAtLte: thirtySecondsAgo });
        });

        this.scope('leader', function(){
            return this.where({ isLeader: true });
        });
    },

    async updateHeartbeat(){
        return this.update({ lastHeartbeatAt: new Date() });
    },

    async claimLeadership(){
        return this.update({ isLeader: true });
    },

    async releaseLeadership(){
        return this.update({ isLeader: false });
    },

    async markDead(){
        return this.update({ status: 'dead', isLeader: false });
    }
};
