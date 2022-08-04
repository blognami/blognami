

require "slick/helpers"

Slick::Helpers.define_method :user do
    return session.user if session
end

