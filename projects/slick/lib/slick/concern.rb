
module Slick::Concern
    
    def missing_method_calls
        @missing_method_calls ||= []
    end

    def included(_module)
        missing_method_calls.each do |missing_method_call|
            args, block = missing_method_call
            _module.send *args, &block
        end
    end

    def method_missing(*args, &block)
        missing_method_calls << [args, block]
    end

end
