
require "slick/database/row"

Slick::Database::Row.register "tag" do
  include :pageable

  has_many :tagable_tags
  has_many :tagables, through: [:tagable_tags, :tagable]

  table_class.define_method :to_field_value do
    out = []
    order_by(:name).each do |tag|
        out << tag.name
    end
    out.join("\n")
  end

end

