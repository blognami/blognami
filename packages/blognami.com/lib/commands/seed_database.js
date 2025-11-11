
export default {
    async run(){
        await this.database.site.update({
            title: 'Blognami',
            copyrightOwner: 'Blognami Ltd',
            navigation: [
                '## Getting Started',
                '- [Introduction](/)',
                '- [Blog](/blog)'
            ].join('\n')
        });
    }
};
