
require "slick/database/row"

require "blognami/models/pageable"
require "blognami/models/tagable"

Slick::Database::Row.register "post" do
    
    WORDS_PER_MINUTE = 275

    include :pageable
    include :tagable
    
    belongs_to :user

    must_not_be_blank :user_id
    must_not_be_blank :title

    before_validation do
        self.published_at = Time.now if published && published_at.nil?
    end

    def reading_minutes
        word_count = body.to_s.gsub(/\W/, ' ').strip.split(/\s+/).count.to_f
        return (word_count / WORDS_PER_MINUTE).ceil
    end

    def excerpt_from_body
        "#{body.to_s.gsub(/\W/, ' ').gsub(/\s+/, ' ').strip[0..252]}..."
    end

end

