
require "slick/database/migration"

Slick::Database::Migration.register("1656756305_create_taggable_tag").define_method "migrate" do
  database.tagable_tags.add_column('tagable_id', 'foreign_key')
  database.tagable_tags.add_column('tag_id', 'foreign_key')
end
