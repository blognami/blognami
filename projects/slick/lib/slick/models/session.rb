
require "slick/database/row"

Slick::Database::Row.register "session" do
    belongs_to :user

    must_not_be_blank :pass_string
    must_not_be_blank :user_id
end
