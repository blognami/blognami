
require "slick/resource_factory"

Slick::ResourceFactory.register("view").define_method "create" do
    Slick::View.create('index')
end
