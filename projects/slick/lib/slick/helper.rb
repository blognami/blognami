
require "slick/registry"
require "slick/helpers"

class Slick::Helper

    class << self

        include Slick::Registry

        def register(name, options = {}, &block)
            out = super
            Slick::Helpers.class_eval("def #{name}(*args, &block); ::Slick::Helper.create(\"#{name}\").call(*args, &block); end")
            out
        end

    end

    include Slick::Helpers

    def call(*args, &block)
        
    end

end
