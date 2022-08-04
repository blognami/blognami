
require "slick/database/migration"

Slick::Database::Migration.register("1656753486_create_session").define_method "migrate" do
  database.sessions.add_column('pass_string', 'string')
  database.sessions.add_column('user_id', 'foreign_key')
  database.sessions.add_column('last_accessed_at', 'time', index: true)
end
