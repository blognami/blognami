
require "slick/helpers"

module Slick
    
    class << self

        include Slick::Helpers

        def resource_provider
            @resource_provider ||= ResourceProvider.new
        end

        def call(env)
            resource_provider.reset do
                resource_provider["env"] = env
                CallHandler.new.handle_call
                response.to_a
            end
        end

    end

end

require "slick/monkey_patches/require_all"
require "slick/view"

require_all("slick/monkey_patches")
require_all("slick/view")
require_all("slick")

require "bundler"

if Slick.project.exist? && ENV['WATCH_PROJECT'] == 'true'
    Slick::ProjectWatcher.watch
end

begin
    Bundler.require(:default, Slick.resource_provider["environment"].to_sym)
rescue Bundler::GemfileNotFound
    # do nothing
end

if Slick.project.exist?
    Slick::Command.unregister("generate-project")
else
    Slick::Command.registered_classes.keys.each do |name|
        Slick::Command.unregister(name) if name != "generate-project" && name != "list-commands"
    end
end