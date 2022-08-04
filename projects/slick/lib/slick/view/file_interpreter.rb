
require "rack/mime"

class Slick::View::FileInterpreter < Slick::FileInterpreter

    def interpret_file
        Slick::View.register(relative_file_path).class_eval "
            class << self
                attr_reader :file_path
            end

            @file_path = #{file_path.dump}

            def render
                response.headers['Content-Type'] = Rack::Mime.mime_type(self.class.file_path.sub(/\\A.*?(\\.[^\\/]+)\\z/, '\\1'))
                response.body << File.read(self.class.file_path)
            end
        "
    end

end
