
class Slick::ExitException < Exception

    attr_reader :block

    def initialize(&block)
        @block = block
    end

end
