
require "slick/command"

Slick::Command.register "generate-model" do

    arg "name"

    def run
        migration_dir_path = "#{project.root_path}/lib/#{project.name.snakeify}/models/";

        generate_file "#{migration_dir_path}/#{name.snakeify}.rb" do
            line
            line "Slick::Database::Row.register \"#{name.snakeify}\" do"
            indent do
                line
            end
            line "end"
            line
        end
    end

end