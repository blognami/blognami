
import { faker } from '@faker-js/faker';

export default {
    async run(){
        if(process.env.TENANCY == 'multi'){
            await this.database.tenants.insert({
                name: 'test',
                host: 'localhost'
            });
        }
    
        if(process.env.NODE_ENV == 'test') return;
    
        await this.database.site.update({
            title: 'Hello World!',
            description: 'Thoughts, stories and ideas.',
            language: 'en'
        });
    
        const user = await this.database.users.insert({
            name: 'Admin',
            email: 'admin@example.com',
            role: 'admin'
        });
    
        for(let i = 0; i < 101; i++){
            await this.database.posts.insert({
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
    }
};
