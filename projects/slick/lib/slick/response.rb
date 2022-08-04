
require "rack"

class Slick::Response < Rack::Response
    
    def to_s
        body.join
    end

    def inspect
        to_s
    end

end
