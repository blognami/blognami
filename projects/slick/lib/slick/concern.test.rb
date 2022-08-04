
require "test_helper"

class Slick::ConcernTest < Minitest::Test

    def test_concern_replays_missing_methods

        concern = Module.new do

            extend Slick::Concern

            foo

        end

        klass = Class.new do

            def self.foo
                @foo_called = true
            end

        end

        assert_nil( klass.instance_eval{ @foo_called })
        
        klass = Class.new do

            def self.foo
                @foo_called = true
            end

            include concern

        end

        assert( klass.instance_eval{ @foo_called })

    end

end
