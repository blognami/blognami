

require "slick/helpers"

Slick::Helpers.define_method :role? do |role|
    user && user.role == role.to_s
end

