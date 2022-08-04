
require "blognami/models/pageable"

Slick::Database::Row.register "page" do
  
    include :pageable

    belongs_to :user

    must_not_be_blank :user_id
    must_not_be_blank :title

    before_validation do
        self.published_at = Time.now if published && published_at.nil?
    end

end
