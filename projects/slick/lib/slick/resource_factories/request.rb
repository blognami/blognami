
require "slick/resource_factory"

Slick::ResourceFactory.register("request").define_method "create" do
    Slick::Request.new(env)
end
