
require "slick/command"

Slick::Command.register("reset-database").define_method "run" do

    run_command "drop-database"
    run_command "init-database"

end
