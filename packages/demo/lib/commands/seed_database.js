
import { faker } from '@faker-js/faker';

export default async ({ site, users, posts }) => {
    if(process.env.NODE_ENV == 'test') return;

    await site.update({
        title: 'Hello World!',
        description: 'Thoughts, stories and ideas.',
        language: 'en'
    })

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'secret',
        role: 'admin'
    });

    for(let i = 0; i < 101; i++){
        await posts.insert({
            userId: user.id,
            title: faker.address.streetName(),
            body: faker.lorem.paragraphs(3),
            featured: i < 3,
            published: true,
            tags: i % 3 == 0 ? `
                Getting Started
            ` : ''
        });
    }
};
