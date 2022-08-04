
require "slick/database/row"

Slick::Database::Row.register "user" do
    
    include :pageable

    has_many :posts

end
