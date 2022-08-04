
require "slick/database/migration"

Slick::Database::Migration.register("1656756294_create_tag").define_method "migrate" do
    database.tags.add_column('name', 'string', index: true)
    database.tags.add_column('slug', 'string', index: true)
end
