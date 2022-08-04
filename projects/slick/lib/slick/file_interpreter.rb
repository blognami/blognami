
require "slick/registry"
require "slick/helpers"

class Slick::FileInterpreter

    class << self

        include Slick::Registry

        def interpret_file(dir_path, file_path)
            create(file_path.sub(/\A.*?\.([^\/]+)\z/, '\1'), dir_path, file_path).interpret_file
        end

    end

    include Slick::Helpers

    attr_reader :dir_path, :file_path, :relative_file_path

    def initialize(dir_path, file_path)
        @dir_path = dir_path
        @file_path = file_path
        @relative_file_path = file_path[dir_path.length..].sub(/\A\//, '');
    end

    def interpret_file
        # by default do nothing
    end

end

