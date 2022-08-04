
require "slick/database/migration"

Slick::Database::Migration.register("1656756273_create_image").define_method "migrate" do
  database.images.add_column('title', 'string')
  database.images.add_column('slug', 'string', index: true)
  database.images.add_column('type', 'string')
  database.images.add_column('data', 'binary')
end
