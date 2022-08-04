
require "slick/resource_factory"

Slick::ResourceFactory.register("response").define_method "create" do
    Slick::Response[200, {"Content-Type" => "text/html"}, []]
end
