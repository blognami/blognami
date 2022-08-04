
require "test_helper"

Class.new Minitest::Test do

    include Slick::Helpers

    def setup
        run_command('reset-database')
    end

    def test_session
        assert_equal 0, sessions.count

        user = users.insert name: 'Admin', email: 'admin@example.com', role: 'admin'

        session = sessions.insert user_id: user.id, pass_string: 'foo'

        assert_equal 1, sessions.count

        assert_equal 'Admin', session.user.name
    end

end

