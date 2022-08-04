
require "slick/database/migration"

Slick::Database::Migration.register("1656753470_create_user").define_method "migrate" do
  database.users.add_column('name', 'string')
  database.users.add_column('email', 'string')
  database.users.add_column('salt', 'string')
  database.users.add_column('role', 'string')
  database.users.add_column('last_successful_sign_in_at', 'time')
end
