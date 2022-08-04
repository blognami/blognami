require "test_helper"

class Slick::CommandTest < Minitest::Test

    BASIC_COMMANDS = [
        "list-commands",
        "start-console"
    ]

    def test_basic_commands_exist
        BASIC_COMMANDS.each do |name|
            refute_nil(Slick::Command.registered_classes[name])
        end
    end

end