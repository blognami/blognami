
require "slick/database/migration"

Slick::Database::Migration.register("1656756283_create_site").define_method "migrate" do
  database.sites.add_column('title', 'string')
  database.sites.add_column('description', 'text')
  database.sites.add_column('accent_color', 'string')
  database.sites.add_column('language', 'string')
end

