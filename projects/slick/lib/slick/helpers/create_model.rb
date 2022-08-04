
require "slick/helpers"

Slick::Helpers.define_method :create_model do |&block|
    Class.new(Slick::Model, &block).new
end
