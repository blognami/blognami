
require "slick/resource_factory"

Slick::ResourceFactory.register("params").define_method "create" do
    out = {}
    begin
        out.merge!(request.GET)
        out.merge!(request.POST)
    rescue Exception => e
        # do nothing
    end
    out.merge!({"_method" => request.request_method.downcase, "_path" => request.path})
    out.paramify
end
