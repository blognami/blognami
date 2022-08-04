
require "slick/registry"
require "slick/helper"
require "slick/helpers"

class Slick::ResourceFactory

    class << self

        include Slick::Registry

        def register(name, options = {}, &block)
            out = super(name)

            out.instance_eval{ @shared = options[:shared] == true }

            Slick::Helper.register(name).define_method "call" do
                ::Slick.resource_provider[self.class.name]
            end

            out
        end

        def shared?
            @shared
        end

    end

    include Slick::Helpers

    def create

    end

end
