
require "slick/database/row"

Slick::Database::Row.register "tagable_tag" do
  belongs_to :tagable
  belongs_to :tag
end
