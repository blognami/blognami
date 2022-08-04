
require "slick/command"
require "rack"

Slick::Command.register("start-server").define_method "run" do
    if ENV['WATCH_PROJECT'] == 'true'
        Rack::Server.start({
            :app => Slick,
            :Port => 3000
        })
    else
        system("WATCH_PROJECT=true bundle exec slick start-server")
    end
end
