

require "slick/helpers"

Slick::Helpers.define_method :signed_in? do
    !user.nil?
end

