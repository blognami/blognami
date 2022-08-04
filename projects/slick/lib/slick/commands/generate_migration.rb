
require "slick/command"

Slick::Command.register "generate-migration" do

    arg "name"

    def run
        migration_dir_path = "#{project.root_path}/lib/#{project.name.snakeify}/migrations/";
        unix_time = Time.now.to_i

        generate_file "#{migration_dir_path}/#{unix_time}_#{name.snakeify}.rb" do
            line
            line "Slick::Database::Migration.register(\"#{unix_time}_#{name.snakeify}\").define_method \"migrate\" do"
            indent do
                line
            end
            line "end"
            line
        end
    end

end