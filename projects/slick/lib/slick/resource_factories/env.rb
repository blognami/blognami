
require "slick/resource_factory"

Slick::ResourceFactory.register("env").define_method "create" do
    {
        "REQUEST_METHOD" => "GET",
        "SCRIPT_NAME" => "",
        "PATH_INFO" => "/",
        "QUERY_STRING" => "",
        "SERVER_NAME" => "localhost",
        "SERVER_PORT" => "80",
        "rack.input" => ""
    }
end
