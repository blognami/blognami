
require "slick/resource_factory"

Slick::ResourceFactory.register("config", :shared => true).define_method "create" do
    if project.exist?
        config_file_path = "#{project.root_path}/config.rb"
        Slick::Workspace.new.instance_eval(
            File.read(config_file_path),
            config_file_path
        )
    else
        {}
    end
end
