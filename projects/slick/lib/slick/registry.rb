
require "slick/concern"
require "slick/util"
require "slick/util/params_hash"

module Slick::Registry

    attr_reader :name

    def concrete?
        true
    end

    def abstract?
        false
    end

    def registered_classes
        @registered_classes ||= {}
    end

    def register(name, options = {}, &block)
        is_abstract = options[:abstract]
        out = is_abstract ? register_abstract_class(name) : register_concrete_class(name)
        out.class_eval(&block) if block
        out
    end

    def unregister(name)
        name = name = name.to_s
        registered_classes.delete name
        self
    end
    
    def include(*args)
        args.each do |arg|
            if arg.kind_of?(String) || arg.kind_of?(Symbol)
                name = arg.to_s
                klass = superclass.registered_classes[name]
                raise "no such abstract class \"#{name}\" has been defined" if klass.nil?
                raise "\"#{name}\" is not an abstract class so can't be included" if !klass.abstract?
                super(klass)
            else
                super(arg)
            end
        end
        self
    end

    def create(name, *args, &block)
        name = name.to_s
        klass = registered_classes[name] || begin
            out = Class.new(self)
            out.instance_eval{ @name = name }
            out
        end
        raise "\"#{name}\" is abstract and can't be instantiated" if klass.abstract?
        klass.new(*args, &block)
    end

    private

    def register_concrete_class(name)
        name = name.to_s
        out = registered_classes[name] ||= Class.new self do
            instance_eval{ @name = name }
        end
        raise "#{name} is already defined as an abstract class so can't be redefined a concrete one" if out.abstract?
        out
    end

    def register_abstract_class(name)
        name = name.to_s
        out = registered_classes[name] ||= Module.new do
            class << self
                include Slick::Concern

                attr_reader :name

                instance_eval{ @name = name }

                def concrete?
                    false
                end

                def abstract?
                    true
                end
            end
        end
        raise "#{name} is already defined as a concrete class so can't be redefined as an abstract one" if out.concrete?
        out
    end
end
