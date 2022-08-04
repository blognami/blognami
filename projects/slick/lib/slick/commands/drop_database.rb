
require "slick/command"

Slick::Command.register("drop-database").define_method "run" do

    database.drop

end

