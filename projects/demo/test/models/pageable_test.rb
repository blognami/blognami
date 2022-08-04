
require "test_helper"

Class.new Minitest::Test do

    include Slick::Helpers

    def setup
        run_command('reset-database')
    end

    def test_pageable
        assert_equal 0, pageables.count

        user = users.insert name: 'Admin', email: 'admin@example.com', role: 'admin'

        assert_equal 1, pageables.count

        post = posts.insert user_id: user.id, title: 'Foo'

        assert_equal 2, pageables.count

        post.update tags: "Foo\nBar"

        assert_equal 4, pageables.count
    end

end
