
import faker from 'faker';

export default async ({ database: { posts } }) => {
    
    for(let i = 0; i < 101; i++){
        await posts.insert({
            title: `post${i} ${faker.lorem.words()}`,
            body: faker.lorem.sentence()
        })
    }

};
