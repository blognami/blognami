export default {

    async migrate(){export default {

        await this.database.table('newsletters', async newsletter => {    async migrate(){

            await newsletter.addColumn('enableMonthly', 'boolean');        await this.database.table('newsletters', async newsletter => {

            await newsletter.addColumn('monthlyPrice', 'decimal');            await newsletter.addColumn('enableMonthly', 'boolean');

            await newsletter.addColumn('enableYearly', 'boolean');            await newsletter.addColumn('monthlyPrice', 'decimal');

            await newsletter.addColumn('yearlyPrice', 'decimal');            await newsletter.addColumn('enableYearly', 'boolean');

            await newsletter.addColumn('currency', 'string', { default: 'USD' });            await newsletter.addColumn('yearlyPrice', 'decimal');

            await newsletter.addColumn('enableFree', 'boolean', { default: true });            await newsletter.addColumn('currency', 'string', { default: 'USD' });

        });            await newsletter.addColumn('enableFree', 'boolean', { default: true });

    }        });

};    }
};
