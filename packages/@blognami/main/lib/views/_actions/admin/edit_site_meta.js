export default {
    async render(){
        const site = await this.database.site;
        const coverImage = await site.coverImage;
        const logoImage = await site.logoImage;

        return this.renderForm(site, {
            fields: [
                'title',
                'copyrightOwner',
                {
                    name: 'description',
                    type: '_admin/_text_field',
                    label: 'Description',
                    hint: 'One line under your title on the homepage, and its meta description unless the homepage sets its own.'
                },
                {
                    name: 'cover',
                    type: '_admin/_image_field',
                    label: 'Cover image',
                    hint: 'Wide, at least 1600×400. Shown as a banner on your homepage.',
                    image: coverImage
                },
                ...(site.coverImageId ? [{ name: 'removeCover', type: 'checkbox', label: 'Remove cover image' }] : []),
                {
                    name: 'logo',
                    type: '_admin/_image_field',
                    label: 'Logo',
                    hint: 'Square, at least 256×256. Shown round beside your title, on bylines and discover cards, and as the favicon.',
                    image: logoImage
                },
                ...(site.logoImageId ? [{ name: 'removeLogo', type: 'checkbox', label: 'Remove logo' }] : [])
            ]
        });
    }
}
