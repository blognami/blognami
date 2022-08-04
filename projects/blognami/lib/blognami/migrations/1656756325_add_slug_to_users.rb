
require "slick/database/migration"

Slick::Database::Migration.register("1656756325_add_slug_to_users").define_method "migrate" do
  database.users.add_column('slug', 'string', index: true)
end
