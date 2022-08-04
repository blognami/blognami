
require "slick/database/migration"

Slick::Database::Migration.register("1656756265_create_post").define_method "migrate" do
  database.posts.add_column('user_id', 'foreign_key')
  database.posts.add_column('title', 'string')
  database.posts.add_column('slug', 'string', index: true)
  database.posts.add_column('body', 'text')
  database.posts.add_column('featured', 'boolean',  index: true)
  database.posts.add_column('published', 'boolean',  index: true)
  database.posts.add_column('published_at', 'time')
end
