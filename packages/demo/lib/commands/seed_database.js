
import faker from 'faker';

export default async ({ users, posts }) => {
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
            body: faker.lorem.paragraphs(3)
        });
    }
};
