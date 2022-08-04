
require "securerandom"

require "slick/database/row"



Slick::Database::Row.register "pageable", abstract: true do
  
    before_validation do
        next if !slug.nil?
        n = 0
        while true
            candidate_slug = generate_candidate_slug(n)
            if database.pageables.slug_eq(candidate_slug).count == 0
                self.slug = candidate_slug
                break
            end
            n += 1
        end
    end

    def generate_candidate_slug(n)
        out = if respond_to? :title
            title.dasherize
        elsif respond_to? :name
            name.dasherize
        else
            SecureRandom.uuid
        end
        return "#{out}-#{n}" if n > 0
        out
    end

end
