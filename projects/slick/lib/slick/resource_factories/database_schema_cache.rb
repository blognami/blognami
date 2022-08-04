
require "slick/resource_factory"

Slick::ResourceFactory.register("database_schema_cache", :shared => true).define_method "create" do
    {}
end
