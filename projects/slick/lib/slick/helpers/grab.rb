
require "slick/helpers"

Slick::Helpers.define_method :grab do |&block|
    previous_response = Slick.resource_provider["response"]
    out = Slick.resource_provider["response"] = Slick::ResourceFactory.create("response").create
    block.call if block
    Slick.resource_provider["response"] = previous_response
    out
end
