
require "slick/command"

Slick::Command.register "generate-project" do

    arg "name", "The project name."
    option "with", "-w", "--with <gem_names...>", "Create a new application with a list of gems."

    def run
        generate_root
    end

    def generate_root
        generate_dir name.snakeify do
            generate_marker_file
            generate_lib
            generate_gemspec
            generate_gemfile
            generate_config
        end
    end

    def generate_marker_file
        generate_file ".slick"
    end

    def generate_lib
        generate_dir "lib" do
            generate_file "#{name.snakeify}.rb" do
                line
                line "module #{name.camelize}"
                indent do
                    line
                end
                line "end"
                line
            end

            generate_dir name.snakeify do
                generate_file "version.rb" do
                    line
                    line "module #{name.camelize}"
                    indent do
                        line "VERSION = \"0.1.0\""
                    end
                    line "end"
                    line
                end
            end
        end
    end

    def generate_gemspec
        generate_file "#{name.snakeify}.gemspec" do
            line
            line "lib = File.expand_path(\"lib\", __dir__)"
            line "$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)"
            line "require \"#{name.snakeify}/version\""
            line
            line "Gem::Specification.new do |spec|"
            indent do
                line "spec.name = \"#{name.snakeify}\""
                line "spec.version = #{name.camelize}::VERSION"
                line "spec.authors = [\"Your Name\"]"
                line "spec.email = [\"your.email@example.com\"]"
                line "spec.summary = \"Coming soon...\""
                line
                line "spec.files= Dir.chdir(File.expand_path('..', __FILE__)) do"
                indent do
                    line "`git ls-files -z`.split(\"\\x0\").reject { |f| f.match(%r{^(test|spec|features)/}) }"
                end
                line "end"
                line
                line "spec.require_paths = [\"lib\"]"
                line
                line "spec.add_dependency \"slick\", \"~> 0\""
            end
            line "end"
            line
        end
    end


    def generate_gemfile
        generate_file "Gemfile" do
            line "source \"https://rubygems.org\""
            line
            line "# Specify your gem's dependencies in #{name.snakeify}.gemspec"
            line "gemspec"
            line
        end
    end

    def generate_config
        generate_file "config.rb" do
            line
            line "{"
            indent do
                line "\"database\" => {"
                indent do
                    line "\"username\" => \"root\","
                    line "\"password\" => \"\","
                    line "\"name\" => \"#{name.snakeify}_\#{environment}\""
                end
                line "}"
            end
            line "}"
            line
        end
    end

end
