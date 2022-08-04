
class Slick::ValidationError < StandardError

    attr_reader :errors

    def initialize(errors = {})
        super(errors.to_s)
        @errors = errors
    end

end

