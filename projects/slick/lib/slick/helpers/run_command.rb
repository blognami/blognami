

require "slick/helpers"

Slick::Helpers.define_method :run_command do |*args|
    Slick::Command.run(*args)
end

