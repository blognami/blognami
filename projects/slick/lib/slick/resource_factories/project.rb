
require "slick/resource_factory"

Slick::ResourceFactory.register("project", :shared => true).define_method "create" do
    Slick::Project.new
end
