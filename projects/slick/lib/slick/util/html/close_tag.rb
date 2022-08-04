

class Slick::Util::Html::CloseTag < Exception

    attr_reader :type

    def initialize(type)
        @type = type
    end

end
