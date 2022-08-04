
require "slick/command"

Slick::Command.register("init-database").define_method "run" do

    run_command "create-database"
    run_command "migrate-database"
    run_command "seed-database"

end
