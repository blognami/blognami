
require "slick/registry"
require "slick/helpers"
require 'optparse'

class Slick::Command

    class << self

        include Slick::Registry

        def run(name = 'list-commands', *args)
            create(name, *args).run
        end

        def args
            @args ||= []
        end

        def arg(name, description = nil, &block)
            args << {
                :name => name.to_s.sub(/\.\.\.$/, ''),
                :grab_remaining? => name.to_s.match?(/\.\.\.$/),
                :description => description,
                :block => block
            }
            class_eval "def #{args.last[:name]}; @#{args.last[:name]}; end"
        end
        
        def options
            @options ||= {}
        end

        def option(name, *args, &block)
            options[name.to_s] = [*args, block]
            class_eval "def #{name}; @#{name}; end"
        end

    end

    include Slick::Helpers
    
    attr_reader :params

    def initialize(*args)
        option_parser = OptionParser.new

        self.class.options.each do |name, args|
            args = args.clone
            block = args.pop || Proc.new{ |value| value }
            option_parser.on *args do |value|
                instance_variable_set "@#{name}", block.call(value)
            end
        end

        banner = ["Usage: slick #{self.class.name}"]
        self.class.args.each do |args|
            banner << " <#{args[:name]}#{args[:grab_remaining?] ? '...' : ''}>"
        end

        if self.class.options.count > 0
            banner << " [options]"
        end

        option_parser.banner = banner.join
        option_parser.parse!(args)

        self.class.args.each do |arg|
            if arg[:grab_remaining?]
                instance_variable_set "@#{arg[:name]}", args
                args = []
            elsif !args.last.nil?
                instance_variable_set "@#{arg[:name]}", args.shift
            else
                raise ArgumentError.new "Expected arg '#{arg[:name]}'"
            end
        end

        if args.length > 0
            raise ArgumentError.new "Unexpected args: #{args}"
        end
        
    end

    def run
        puts "No such command \"#{self.class.name}\""
    end

end
