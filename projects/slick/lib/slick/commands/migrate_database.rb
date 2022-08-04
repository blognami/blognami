
require "slick/command"

Slick::Command.register("migrate-database").define_method "run" do

    database.migrate

end

