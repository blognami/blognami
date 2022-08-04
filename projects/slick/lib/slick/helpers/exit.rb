

require "slick/helpers"

Slick::Helpers.define_method :exit do |&block|
    raise Slick::ExitException.new(&block)
end
