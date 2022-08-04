
require "slick/command"

Slick::Command.register("list-commands").define_method "run" do

    puts ""
    puts "The following commands are available:"
    puts ""
    Slick::Command.registered_classes.keys.sort.each do |name|
        puts "  * #{name.green}"
    end
    puts ""

end


