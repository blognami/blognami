
require "slick/command"

Slick::Command.register("list-views").define_method "run" do

    puts ""
    puts "The following views are available:"
    puts ""
    Slick::View.registered_classes.keys.sort.each do |name|
        puts "  * #{name.green}"
    end
    puts ""

end


