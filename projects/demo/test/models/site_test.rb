
require "test_helper"

Class.new Minitest::Test do

    include Slick::Helpers

    def setup
        run_command('reset-database')
    end

    def test_site
        assert_equal '', site.title

        assert_equal 1, sites.count
    end

end
