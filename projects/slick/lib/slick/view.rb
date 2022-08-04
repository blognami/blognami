
require "slick/registry"
require "slick/helpers"

class Slick::View

    class << self

        include Slick::Registry

        def render(name, params = {}, &block)
            previous_view = Slick.resource_provider["view"]
            previous_params = Slick.resource_provider["params"]
            Slick.resource_provider["view"] = create(name)
            Slick.resource_provider["params"] = params.paramify
            begin
                Slick.resource_provider["view"].render(&block)
            ensure
                Slick.resource_provider["view"] = previous_view
                Slick.resource_provider["params"] = previous_params
            end
        end

    end

    include Slick::Helpers

    def render(&block)
        # by default do nothing
    end

end

