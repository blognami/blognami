
require "slick/database/migration"

Slick::Database::Migration.register("1656756336_create_page").define_method "migrate" do
  database.pages.add_column('user_id', 'foreign_key')
  database.pages.add_column('title', 'string')
  database.pages.add_column('slug', 'string', index: true)
  database.pages.add_column('body', 'text')
  database.pages.add_column('published', 'boolean',  index: true)
  database.pages.add_column('published_at', 'time')
end
