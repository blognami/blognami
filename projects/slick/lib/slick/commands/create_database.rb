
require "slick/command"

Slick::Command.register("create-database").define_method "run" do

    database.create
    
end

