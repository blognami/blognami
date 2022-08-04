
require "slick/helpers"

Slick::Helpers.define_method :echo do |stringable|
    response.body << stringable.to_s
end
