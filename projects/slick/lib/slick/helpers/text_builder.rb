
require "slick/helpers"

module Slick::Helpers

    def line(stringable = "")
        if response.body.length > 0
            echo "\n#{stringable}"
        else
            echo stringable
        end
        nil
    end

    def indent(&block)
        response = grab(&block)
        if response.body.length > 0
            lines = response.to_s.split(/\n/, -1)
            lines << "" if lines.length == 0
            lines.each do |stringable|
                line "  #{stringable}"
            end
        end
        nil
    end

end
