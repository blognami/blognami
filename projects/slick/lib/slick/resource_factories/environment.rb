
require "slick/resource_factory"

Slick::ResourceFactory.register("environment", :shared => true).define_method "create" do
    ENV["RACK_ENV"] || "development"
end
