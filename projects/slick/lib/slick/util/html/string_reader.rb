
class Slick::Util::Html::StringReader
    
    def initialize(stringable)
        @string = stringable.to_s
    end

    def length
        @string.length
    end

    def to_s
        @string
    end

    def match(pattern)
        out = @string.match(pattern)
        if out
            @string = @string[out[0].length...]
        end
        out
    end
    
end
