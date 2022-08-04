
require "faker"

Slick::Command.register("seed-database").define_method "run" do
    # if(process.env.TENANCY == 'multi'){
    #     await tenants.insert({
    #         name: 'test',
    #         host: 'localhost'
    #     });
    # }

    return if environment == 'test'

    site.update({
        title: 'Hello World!',
        description: 'Thoughts, stories and ideas.',
        language: 'en'
    })

    user = users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    101.times do |i|
        posts.insert({
            user_id: user.id,
            title: Faker::Address.street_name,
            body: Faker::Lorem.paragraphs(number: 3).join("\n"),
            featured: i < 3,
            published: true,
            published_at: Faker::Time.between_dates(from: Date.today - i - 1, to: Date.today - 1, period: :all),
            tags: i % 3 == 0 ? "Getting Started" : ""
        })
    end
end