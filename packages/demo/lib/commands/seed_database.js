
import { faker } from '@faker-js/faker';

export default async ({ site, users, posts }) => {
    if(process.env.NODE_ENV == 'test') return;

    await site.update({
        title: 'Hello World!',
        description: 'Thoughts, stories and ideas.',
        language: 'en',
        primaryNavigation: `
* [Home](/)
* [About](/)
* [Collection](/)
* [Author](/)
* [Portal](/)
        `,
        secondaryNavigation: `
* [Data & privacy](/privacy)
* [Contact](/contact)
* [Contribute →](/contribute)
        `
    })

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'secret',
        role: 'admin'
    });

    const visibilityOptions =  [
        'public',
        'members-only',
        'paid-members-only'
    ];

    for(let i = 0; i < 101; i++){
        await posts.insert({
            userId: user.id,
            title: faker.address.streetName(),
            excerpt: i % 3 == 0 ? faker.lorem.paragraphs(1) : '',
            body: faker.lorem.paragraphs(3),
            featured: i < 3,
            published: true,
            visibility: visibilityOptions[i % 3],
            tags: i % 3 == 0 ? `
                Getting Started
            ` : ''
        });
    }
};
