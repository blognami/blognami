
require "slick/resource_factory"

Slick::ResourceFactory.register("database").define_method "create" do
    Slick::Database.new(config[:database])
end
